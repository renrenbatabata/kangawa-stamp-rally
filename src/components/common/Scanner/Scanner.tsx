import { useState, useRef, useEffect, useCallback } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import styles from "./Scanner.module.css"; 

interface ScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError: (message: string) => void;
  isScanning: boolean;
  setIsScanning: (value: boolean) => void;
}

const Scanner: React.FC<ScannerProps> = ({
  onScanSuccess,
  onScanError,
  isScanning,
  setIsScanning,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);
  const [scannerControls, setScannerControls] =
    useState<IScannerControls | null>(null);

  const startScan = useCallback(async () => {
    if (!videoRef.current) return;

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

      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
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
            controls.stop();
            setIsScanning(false);
            setScannerControls(null);
            onScanSuccess(result.getText());
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
          onScanError(
            "カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。"
          );
        } else if (errName === "NotReadableError") {
          onScanError(
            "カメラが使用中です。他のアプリを閉じてもう一度お試しください。"
          );
        } else {
          onScanError("カメラの起動に失敗しました: 不明なエラー");
        }
      } else {
        onScanError("カメラの起動に失敗しました: 不明なエラー");
      }
    }
  }, [onScanSuccess, onScanError, setIsScanning]);

  useEffect(() => {
    if (isScanning) {
      startScan();
    }
    return () => {};
  }, [isScanning, startScan]);

  useEffect(() => {
    return () => {
      if (scannerControls) {
        scannerControls.stop();
      }
      if (codeReader.current) {
        codeReader.current = null;
      }
    };
  }, [scannerControls]);

  return (
    <video
      ref={videoRef}
      className={styles.video} 
      playsInline
      autoPlay
      muted
    />
  );
};

export default Scanner;