// React
import { useRef, useEffect } from "react";

// 内部モジュール
import { useQRCodeScanner } from "../../hooks/useQRCodeScanner";

// CSS
import styles from "./CameraPage.module.css";

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isScanning, errorMessage, startScan, stopScan } = useQRCodeScanner(videoRef);

  useEffect(() => {
    startScan();
    return () => {
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // マウント時のみ実行

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