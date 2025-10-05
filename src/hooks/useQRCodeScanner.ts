import { useState, useRef, useCallback, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";

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

  useEffect(() => {
    return () => {
      if (scannerControls) {
        scannerControls.stop();
        console.log("useEffect cleanup: QR Code Reader stopped.");
      }
    };
  }, [scannerControls]); 

  const startScan = useCallback(async () => {
    if (isScanning || !videoRef.current) return;
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
            device.label.includes("environment")
        );
        selectedDeviceId = backCamera
          ? backCamera.deviceId
          : videoInputDevices[0].deviceId;
      } catch (e) {
        console.warn(
          "デバイスの列挙に失敗しました。デフォルトのカメラを使用します。",
          e
        );
      }

      const videoElement = videoRef.current as HTMLVideoElement; 

      const controls = await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoElement,
        (result, err) => {
          if (result) {
            controls.stop();
            setScannerControls(null); 
            setIsScanning(false);
            
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
                      console.log("クイズデータ取得モック成功:", foundStamp);
                      navigate("/quiz", {
                        state: { stampData: foundStamp },
                      });
                    } else {
                      console.error(
                        "モックデータに一致するスタンプIDが見つかりませんでした。"
                      );
                      navigate(FAIL_PATH);
                    }
                  } else {
                    if (!apiBaseUrl) {
                      throw new Error("API base URL is not configured."); 
                    }
                    
                    const apiUrl = `${apiBaseUrl}/quiz?stampId=${encodeURIComponent(stampId)}`;
                    
                    const response = await fetch(apiUrl, {
                      method: "GET",
                      headers: { "Content-Type": "application/json" },
                    });

                    if (response.ok) {
                      const quizDataFromApi = await response.json();
                      console.log("クイズデータ取得成功:", quizDataFromApi);
                      
                      const stampData = {
                        stampNo: stampId,
                        quizDto: quizDataFromApi,
                      };
                      
                      navigate("/quiz", {
                        state: { stampData: stampData },
                      });
                    } else {
                      console.error(
                        "クイズデータ取得失敗:",
                        response.status,
                        await response.text()
                      );
                      navigate(FAIL_PATH);
                    }
                  }
                } catch (apiError) {
                  console.error(
                    "API呼び出し中にエラーが発生しました:",
                    apiError
                  );
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
          if (err) {
            console.error("QR Code Scan Error:", err);
          }
        }
      );
      setScannerControls(controls);
    } catch (error: unknown) {
      setIsScanning(false);
      console.error("Camera access error:", error);
      if (error instanceof Error) {
        switch (error.name) {
          case "NotAllowedError":
          case "NotFoundError":
            setErrorMessage(
              "カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。"
            );
            break;
          case "NotReadableError":
            setErrorMessage(
              "カメラが使用中です。他のアプリを閉じてもう一度お試しください。"
            );
            break;
          default:
            setErrorMessage(`カメラの起動に失敗しました: ${error.message}`);
        }
      } else {
        setErrorMessage("カメラの起動に失敗しました: 不明なエラー");
      }
    }
  }, [videoRef, navigate, isScanning]);

  const stopScan = useCallback(() => {
    if (scannerControls) {
      scannerControls.stop();
      setScannerControls(null);
      setIsScanning(false);
      console.log("QR Code Reader stopped via controls");
    }
  }, [scannerControls]);

  return { isScanning, errorMessage, startScan, stopScan };
};