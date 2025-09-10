import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import styles from "./CameraPage.module.css";

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const codeReader = useRef<BrowserQRCodeReader | null>(null);
  const [scannerControls, setScannerControls] =
    useState<IScannerControls | null>(null);

  const startScan = useCallback(async () => {
    if (!videoRef.current) return;

    setErrorMessage(null);
    setIsScanning(true);

    try {
      const hints = new Map();
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
        },
      };
      hints.set(2, constraints);
      
      if (!codeReader.current) {
        codeReader.current = new BrowserQRCodeReader(hints);
      }

      const videoInputDevices =
        await BrowserQRCodeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error("カメラが見つかりませんでした。");
      }

      const backCamera = videoInputDevices.find(
        (device) => device.label.includes("back") || device.label.includes("environment")
      );
      const selectedDeviceId = backCamera
        ? backCamera.deviceId
        : videoInputDevices[0].deviceId;

      const controls = await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            console.log("QR Code detected:", result.getText());
            controls.stop();
            setIsScanning(false);
            setScannerControls(null);

            const qrData = result.getText();
            if (qrData.startsWith("stamp_point_")) {
              const stampId = qrData.split("_").pop();
              console.log("Stamp ID detected:", stampId);
              navigate("/quiz");
            } else {
              navigate("/scan/fail");
            }
          }

          if (err) {
            const isNotFoundError =
              err instanceof Error && err.name === "NotFoundException";
            if (!isNotFoundError) {
              console.error("QR Code Scan Error:", err);
            }
          }
        }
      );
      setScannerControls(controls);
      console.log("Scanning started...");
    } catch (error: unknown) {
      setIsScanning(false);
      setScannerControls(null);
      console.error("Camera access error:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        typeof (error as { name?: unknown }).name === "string"
      ) {
        const errName = (error as { name: string }).name;
        if (errName === "NotAllowedError" || errName === "NotFoundError") {
          setErrorMessage(
            "カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。"
          );
        } else if (errName === "NotReadableError") {
          setErrorMessage(
            "カメラが使用中です。他のアプリを閉じてもう一度お試しください。"
          );
        } else {
          setErrorMessage(
            `カメラの起動に失敗しました: ${
              "message" in error &&
              typeof (error as { message?: unknown }).message === "string"
                ? (error as { message: string }).message
                : "不明なエラー"
            }`
          );
        }
      } else {
        setErrorMessage("カメラの起動に失敗しました: 不明なエラー");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!isScanning && !errorMessage) {
      startScan();
    }
    return () => {};
  }, [startScan, isScanning, errorMessage]);

  useEffect(() => {
    return () => {
      if (scannerControls) {
        scannerControls.stop();
        console.log("QR Code Reader stopped via controls (component unmount)");
      }
      if (codeReader.current) {
        codeReader.current = null;
      }
    };
  }, [scannerControls]);

  return (
    <div className={styles.cameraPage}>
      {!errorMessage && (
        <video
          ref={videoRef}
          className={styles.cameraBackground}
          playsInline
          autoPlay
          muted
        />
      )}

      <div className={styles.uiOverlay}>
        <div className={styles.speechBubble}>
          <p className={styles.bubbleText}>QRコードを よみこんでね！</p>
        </div>

        <div className={styles.cameraScanGuide}>
          {errorMessage && (
            <div className={styles.cameraErrorOverlay}>
              <p className={styles.errorText}>{errorMessage}</p>
              <button className={styles.retryButton} onClick={startScan}>
                再試行
              </button>
            </div>
          )}
        </div>

        <div className={styles.buttonContainer}>
          {isScanning && !errorMessage && (
            <p className={styles.scanningMessage}>スキャン中...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraPage;