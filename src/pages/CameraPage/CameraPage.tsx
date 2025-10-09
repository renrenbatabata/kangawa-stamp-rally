// React
import { useRef, useEffect } from "react";

// 内部モジュール
import { useQRCodeScanner } from "../../hooks/useQRCodeScanner";
import { logger } from "../../utils/logger";

// CSS
import styles from "./CameraPage.module.css";

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isScanning, errorMessage, startScan, stopScan, detectedCamera } =
    useQRCodeScanner(videoRef);

  useEffect(() => {
    // マウント時にスキャンを開始
    const initScan = async () => {
      await startScan();
    };
    initScan();

    // アンマウント時にスキャンを停止
    return () => {
      stopScan();
    };
  }, [startScan, stopScan]);

  // デバッグ用：カメラ情報をコンソールに出力
  useEffect(() => {
    if (detectedCamera) {
      logger.log("検出されたカメラ情報:", {
        label: detectedCamera.label,
        deviceId: detectedCamera.deviceId,
        groupId: detectedCamera.groupId,
      });
    }
  }, [detectedCamera]);

  return (
    <div className={styles.cameraPage}>
      <video
        ref={videoRef}
        className={errorMessage ? styles.hidden : styles.cameraBackground}
        playsInline
        autoPlay
        muted
      />

      <div className={styles.uiOverlay}>
        <div className={styles.speechBubble}>
          <p className={styles.bubbleText}>QRコードを よみこんでね！</p>
        </div>

        <div className={styles.cameraScanGuide}>
          {errorMessage && (
            <div className={styles.cameraErrorOverlay}>
              <p className={styles.errorText}>{errorMessage}</p>
              <button
                type="button"
                className={styles.retryButton}
                onClick={startScan}
              >
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