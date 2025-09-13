import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
// 最初に環境変数を定数に読み込む
const QR_PREFIX = import.meta.env.VITE_QR_PREFIX;
const SUCCESS_PATH = import.meta.env.VITE_SUCCESS_PATH;
const FAIL_PATH = import.meta.env.VITE_FAIL_PATH;

if (!QR_PREFIX || !SUCCESS_PATH || !FAIL_PATH) {
    throw new Error("必要な環境変数(.env)が設定されていません: VITE_QR_PREFIX, VITE_SUCCESS_PATH, VITE_FAIL_PATH");
}

export const useQRCodeScanner = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const codeReader = useRef<BrowserQRCodeReader | null>(null);
    const [scannerControls, setScannerControls] = useState<IScannerControls | null>(null);

    const startScan = useCallback(async () => {
        if (isScanning || !videoRef.current) return;

        setErrorMessage(null);
        setIsScanning(true);

        try {
            if (!codeReader.current) {
                codeReader.current = new BrowserQRCodeReader();
            }

            const selectedDeviceId = await (async () => {
                const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
                if (videoInputDevices.length === 0) {
                    throw new Error("カメラが見つかりませんでした。");
                }
                const backCamera = videoInputDevices.find(
                    (device) => device.label.includes("back") || device.label.includes("environment")
                );
                return backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId;
            })();

            const controls = await codeReader.current.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        controls.stop();
                        const qrData = result.getText();
                        if (qrData.startsWith(QR_PREFIX)) {
                            navigate(SUCCESS_PATH);
                        } else {
                            navigate(FAIL_PATH);
                        }
                    }
                    // エラーがNotFoundExceptionの場合、NotFoundException2(開発環境時)の場合、何もせずに早期リターン
                    if (err instanceof Error && (err.name === "NotFoundException" || err.name === "NotFoundException2")) {
                        return;
                    }
                    // その他の予期せぬエラーのみコンソールに出力
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
                        setErrorMessage("カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。");
                        break;
                    case "NotReadableError":
                        setErrorMessage("カメラが使用中です。他のアプリを閉じてもう一度お試しください。");
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