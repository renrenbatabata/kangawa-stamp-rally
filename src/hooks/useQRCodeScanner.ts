import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrowserQRCodeReader,
  type IScannerControls,
} from "@zxing/browser";
import { logger } from "../utils/logger";

// 環境変数
const QR_PREFIX = import.meta.env.VITE_QR_PREFIX;
const SUCCESS_PATH = import.meta.env.VITE_SUCCESS_PATH;
const FAIL_PATH = import.meta.env.VITE_FAIL_PATH;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 定数
const BACK_CAMERA_ID_KEY = "preferredBackCameraId";
const CAMERA_RESET_DELAY_MS = 500; // Android対策：待機時間を延長（100ms → 500ms）

/**
 * バックカメラのdeviceIdを取得する関数
 * 保存されたdeviceIdを優先し、なければラベルから推測する
 * @param devices - 利用可能なメディアデバイスのリスト
 * @returns 利用すべきデバイスID、見つからなければnull
 */
const getBackCameraId = (devices: MediaDeviceInfo[]): string | null => {
  // 1. まず、以前保存したdeviceIdがあるかチェック
  const savedId = localStorage.getItem(BACK_CAMERA_ID_KEY);
  if (savedId) {
    // 保存されたIDが現在の利用可能なデバイスリストにあるか確認
    const isStillAvailable = devices.some(
      (device) => device.deviceId === savedId
    );
    if (isStillAvailable) {
      logger.log("保存されたバックカメラIDを優先します:", savedId);
      return savedId; // 💡あればそれを最優先で利用
    } else {
      // 保存されていたIDがもう使えない場合は削除（稀なケース）
      logger.warn("保存されたカメラIDが利用不可のため削除します");
      localStorage.removeItem(BACK_CAMERA_ID_KEY);
    }
  }

  // 2. 保存がなければ、ラベルから推測する
  const backCamera = devices.find((device) => {
    const lowerLabel = device.label.toLowerCase();

    return (
      lowerLabel.includes("back") ||
      lowerLabel.includes("environment") ||
      lowerLabel.includes("video device 1") ||
      lowerLabel.includes("背面") ||
      lowerLabel.includes("リアカメラ")
    );
  });

  if (backCamera) {
    logger.log("ラベルからバックカメラを特定しました:", backCamera.deviceId);
    return backCamera.deviceId;
  }

  // 3. 見つからなければnullを返す
  logger.warn("特定のバックカメラを見つけられませんでした。");
  return null;
};

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
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);
  const [scannerControls, setScannerControls] =
    useState<IScannerControls | null>(null);
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
    logger.log("startScan: カメラ起動開始");
    
    if (!videoRef.current) {
      logger.warn("startScan: videoRef.currentがnullです");
      return;
    }

    // 既存のスキャナーコントロールを停止
    if (scannerControls) {
      try {
        logger.log("startScan: 既存のscannerControlsを停止");
        scannerControls.stop();
      } catch (error) {
        logger.warn("startScan: scannerControls停止エラー:", error);
      }
      setScannerControls(null);
    }

    // 既存のビデオストリームをクリーンアップ（重要：Android対策）
    if (videoRef.current.srcObject) {
      logger.log("startScan: 既存のビデオストリームをクリーンアップ");
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          logger.warn("startScan: トラック停止エラー:", error);
        }
      });
      videoRef.current.srcObject = null;
    }

    if (isScanning) {
      logger.log("startScan: 既にスキャン中のため待機");
      setIsScanning(false);
      await new Promise((resolve) => setTimeout(resolve, CAMERA_RESET_DELAY_MS));
    }

    setErrorMessage(null);
    setIsCameraReady(false);

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

        logger.log("利用可能なカメラデバイス:", videoInputDevices);

        const backCameraId = getBackCameraId(videoInputDevices);

        if (backCameraId) {
          selectedDeviceId = backCameraId;
          // デバイス情報を状態に保存（デバッグ用）
          const cameraDevice = videoInputDevices.find(
            (device) => device.deviceId === backCameraId
          );
          if (cameraDevice) {
            setDetectedCamera(cameraDevice);
          }
        } else {
          selectedDeviceId = videoInputDevices[0].deviceId;
          setDetectedCamera(videoInputDevices[0]);
        }
      } catch (error) {
        logger.warn("デバイスの列挙に失敗しました:", error);
      }

      const videoElement = videoRef.current;
      if (!videoElement) {
        setIsScanning(false);
        return;
      }

      // カメラが準備完了したら通知
      const handleCameraReady = () => {
        setIsCameraReady(true);
      };
      videoElement.addEventListener('loadedmetadata', handleCameraReady, { once: true });

      const controls = await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoElement,
        (result, err) => {
          if (result) {
            controls.stop();
            setScannerControls(null);
            setIsScanning(false);
            setIsProcessing(true); // 処理中状態を開始

            // ビデオストリームのトラックを停止
            if (videoElement.srcObject) {
              const stream = videoElement.srcObject as MediaStream;
              stream.getTracks().forEach((track) => {
                track.stop();
              });
              videoElement.srcObject = null;
            }

            const qrData = result.getText();
            logger.log("QRコード読み取り成功:", qrData);

            if (qrData.startsWith(QR_PREFIX)) {
              const stampId = qrData;
              const getQuiz = async () => {
                try {
                  // Android対策：カメラリソースの完全な解放を待つ
                  await new Promise((resolve) => setTimeout(resolve, 300));
                  
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
                } catch (error) {
                  logger.error("Quiz data fetch error:", error);
                  navigate(FAIL_PATH);
                }
              };
              getQuiz();
            } else {
              // Android対策：カメラリソースの完全な解放を待つ
              setTimeout(() => {
                navigate(FAIL_PATH);
              }, 300);
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

      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings();
          const actualDeviceId = settings.deviceId;
          if (actualDeviceId) {
            logger.log("実際に使用されたカメラID:", actualDeviceId);
            localStorage.setItem(BACK_CAMERA_ID_KEY, actualDeviceId);
          }
        }
      }
    } catch (error: unknown) {
      setIsScanning(false);
      setIsCameraReady(false);
      setIsProcessing(false);

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
  }, [videoRef, navigate, isScanning, scannerControls]);

  const stopScan = useCallback(() => {
    logger.log("カメラを停止します");
    
    // 1. スキャナーコントロールの停止
    if (scannerControls) {
      try {
        scannerControls.stop();
        logger.log("scannerControls.stop() 完了");
      } catch (error) {
        logger.warn("scannerControls停止エラー:", error);
      }
      setScannerControls(null);
    }
    
    // 2. ビデオストリームのクリーンアップ
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
          logger.log(`トラック停止: ${track.kind}`);
        } catch (error) {
          logger.warn("トラック停止エラー:", error);
        }
      });
      videoRef.current.srcObject = null;
    }
    
    // 3. 状態のリセット
    setIsScanning(false);
    setIsCameraReady(false);
    setIsProcessing(false);
    setErrorMessage(null);
    
    logger.log("カメラ停止完了");
  }, [videoRef, scannerControls]);

  // ★ 3. 戻り値に detectedCamera, isCameraReady, isProcessing を追加
  return { isScanning, isCameraReady, isProcessing, errorMessage, startScan, stopScan, detectedCamera };
};