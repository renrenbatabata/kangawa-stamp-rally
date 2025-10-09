import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrowserQRCodeReader,
  type IScannerControls,
} from "@zxing/browser";

// 環境変数
const QR_PREFIX = import.meta.env.VITE_QR_PREFIX;
const SUCCESS_PATH = import.meta.env.VITE_SUCCESS_PATH;
const FAIL_PATH = import.meta.env.VITE_FAIL_PATH;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 環境変数のチェック
if (!QR_PREFIX || !SUCCESS_PATH || !FAIL_PATH) {
  throw new Error(
    "必要な環境変数(.env)が設定されていません: VITE_QR_PREFIX, VITE_SUCCESS_PATH, VITE_FAIL_PATH"
  );
}
if (!USE_MOCK_DATA && !apiBaseUrl) {
  throw new Error(
    "USE_MOCK_DATAがfalseの場合、VITE_API_BASE_URLの設定が必要です。"
  );
}

export const useQRCodeScanner = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);
  const [scannerControls, setScannerControls] =
    useState<IScannerControls | null>(null);
  // ★ 1. カメラ情報を保持するための状態を追加
  const [detectedCamera, setDetectedCamera] =
    useState<MediaDeviceInfo | null>(null);

  useEffect(() => {
    return () => {
      if (scannerControls) {
        scannerControls.stop();
      }
    };
  }, [scannerControls]);

  const startScan = useCallback(async () => {
    if (!videoRef.current) return;

    // 既存のスキャナーが動作中の場合は停止
    if (scannerControls) {
      try {
        scannerControls.stop();
      } catch {
        // 停止エラーは無視
      }
      setScannerControls(null);
    }

    // スキャン中の場合は一度停止してから再開
    if (isScanning) {
      setIsScanning(false);
      // 状態更新を待つため少し遅延
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage(
        "お使いのブラウザはカメラ機能をサポートしていません。または、HTTP環境ではカメラ機能は利用できません。"
      );
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    try {
      if (!codeReader.current) {
        codeReader.current = new BrowserQRCodeReader();
      }

      let selectedDeviceId: string | undefined;

      try {
        const videoInputDevices =
          await BrowserQRCodeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          throw new Error("カメラが見つかりませんでした。");
        }
        const backCamera = videoInputDevices.find(
          (device) =>
            device.label.includes("back") ||
            device.label.includes("environment")||
            device.label.toLowerCase().includes("video device 1")
        );
        console.log(videoInputDevices);
        console.log(backCamera);

        // ★ 2. 検出した背面カメラの情報を状態に保存
        if (backCamera) {
          setDetectedCamera(backCamera);
        } else if (videoInputDevices.length > 0) {
          // 背面カメラがない場合は、最初のカメラ情報を保存
          setDetectedCamera(videoInputDevices[0]);
        }

        selectedDeviceId = backCamera
          ? backCamera.deviceId
          : videoInputDevices[0].deviceId;
      } catch {
        // デバイスの列挙に失敗した場合はデフォルトのカメラを使用
      }

      const videoElement = videoRef.current as HTMLVideoElement;

      const controls = await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoElement,
        (result, err) => {
          if (result) {
            // カメラを確実に停止
            controls.stop();
            setScannerControls(null);
            setIsScanning(false);

            // ビデオストリームのトラックを停止
            if (videoElement.srcObject) {
              const stream = videoElement.srcObject as MediaStream;
              stream.getTracks().forEach((track) => {
                track.stop();
              });
              videoElement.srcObject = null;
            }

            const qrData = result.getText();

            if (qrData.startsWith(QR_PREFIX)) {
              const stampId = qrData;
              const getQuiz = async () => {
                try {
                  if (USE_MOCK_DATA) {
                    const response = await fetch("/data/add_mock.json");
                    const mockData = await response.json();

                    type Stamp = { stampNo: string; [key: string]: unknown };
                    const foundStamp = (mockData as Stamp[]).find(
                      (stamp: Stamp) => stamp.stampNo === stampId
                    );

                    if (foundStamp) {
                      navigate("/quiz", {
                        state: { stampData: foundStamp },
                      });
                    } else {
                      navigate(FAIL_PATH);
                    }
                  } else {
                    if (!apiBaseUrl) {
                      throw new Error("API base URL is not configured.");
                    }

                    const apiUrl = `${apiBaseUrl}/quiz?stampId=${encodeURIComponent(
                      stampId
                    )}`;

                    const response = await fetch(apiUrl, {
                      method: "GET",
                      headers: { "Content-Type": "application/json" },
                    });

                    if (response.ok) {
                      const quizDataFromApi = await response.json();

                      const stampData = {
                        stampNo: stampId,
                        quizDto: quizDataFromApi,
                      };

                      navigate("/quiz", {
                        state: { stampData: stampData },
                      });
                    } else {
                      navigate(FAIL_PATH);
                    }
                  }
                } catch {
                  navigate(FAIL_PATH);
                }
              };
              getQuiz();
            } else {
              navigate(FAIL_PATH);
            }
          }
          if (
            err instanceof Error &&
            (err.name === "NotFoundException" ||
              err.name === "NotFoundException2")
          ) {
            return;
          }
        }
      );
      setScannerControls(controls);
    } catch (error: unknown) {
      setIsScanning(false);

      // カメラリソースのクリーンアップ
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {
            // 停止エラーは無視
          }
        });
        videoRef.current.srcObject = null;
      }

      let newErrorMessage: string;

      if (error instanceof Error) {
        switch (error.name) {
          case "NotAllowedError":
            // カメラへのアクセスが拒否された場合
            newErrorMessage =
              "カメラの使用が許可されていません。\n設定から「カメラを許可」にしてください。\n\n詳しくはマップページの「その他」→「カメラ設定」をご確認ください。";
            break;
          case "NotFoundError":
            // カメラが見つからない
            newErrorMessage =
              "カメラが見つかりませんでした。\nお使いのデバイスにカメラが搭載されているか確認してください。";
            break;
          case "NotReadableError":
            // カメラが使用中の場合
            newErrorMessage =
              "カメラが使用中です。\n他のアプリでカメラを使っていないか確認してください。";
            break;
          default:
            newErrorMessage =
              "カメラの起動に失敗しました。\nしばらく待ってから再度お試しください。";
        }
      } else {
        newErrorMessage =
          "カメラの起動に失敗しました。\nページを再読み込みしてお試しください。";
      }

      setErrorMessage(newErrorMessage);
    }
  }, [videoRef, navigate]);

  const stopScan = useCallback(() => {
    // ビデオストリームのクリーンアップ
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  // ★ 3. 戻り値に detectedCamera を追加
  return { isScanning, errorMessage, startScan, stopScan, detectedCamera };
};