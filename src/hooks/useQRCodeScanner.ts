import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
// useUserContext のインポートは、uuidの使用がなくなったため削除しました。

const QR_PREFIX = import.meta.env.VITE_QR_PREFIX;
const SUCCESS_PATH = import.meta.env.VITE_SUCCESS_PATH;
const FAIL_PATH = import.meta.env.VITE_FAIL_PATH;
const USE_MOCK_DATA = import.meta.env.VITE_USE_MITE_USE_MOCK_DATA === "true";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// 環境変数チェックを強化
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

// 取得したクイズデータ/スタンプデータの型を定義
type StampData = { 
    stampNo: string; 
    quizDto?: { [key: string]: unknown }; // APIがクイズデータのみを返す可能性も考慮しオプショナルに
    [key: string]: unknown;
} | null;


export const useQRCodeScanner = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const navigate = useNavigate();
  
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);
  const [scannerControls, setScannerControls] =
    useState<IScannerControls | null>(null);

  // ★★★ 新しい状態：ナビゲーションのトリガーとデータ保持用 ★★★
  const [quizData, setQuizData] = useState<StampData>(null);
  const [shouldFail, setShouldFail] = useState(false);

  // ★★★ useEffectでナビゲーションを実行し、警告を回避 ★★★
  useEffect(() => {
    if (quizData) {
      // 成功時：/quiz へナビゲート
      navigate("/quiz", {
        state: { stampData: quizData },
      });
      // 状態をクリア
      setQuizData(null); 
    } else if (shouldFail) {
      // 失敗時：FAIL_PATH へナビゲート
      navigate(FAIL_PATH);
      setShouldFail(false);
    }
    // navigateは依存配列に含める
  }, [quizData, shouldFail, navigate]);


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

      // videoRef.currentの非nullアサーション
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
                      // navigate()の代わりに状態をセット
                      setQuizData(foundStamp as StampData); 
                    } else {
                      console.error(
                        "モックデータに一致するスタンプIDが見つかりませんでした。"
                      );
                      setShouldFail(true); // 失敗フラグをセット
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
                      // navigate()の代わりに状態をセット
                      setQuizData(quizDataFromApi as StampData);
                    } else {
                      console.error(
                        "クイズデータ取得失敗:",
                        response.status,
                        await response.text()
                      );
                      setShouldFail(true); // 失敗フラグをセット
                    }
                  }
                } catch (apiError) {
                  console.error(
                    "API呼び出し中にエラーが発生しました:",
                    apiError
                  );
                  setShouldFail(true); // 失敗フラグをセット
                }
              };
              getQuiz();
            } else {
              setShouldFail(true); // 失敗フラグをセット
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
  }, [videoRef, isScanning]); // navigateはuseEffect内に移動したため削除

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