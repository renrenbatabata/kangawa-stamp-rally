// React
import { useRef, useEffect } from "react";

// 内部モジュール
import { useQRCodeScanner } from "../../hooks/useQRCodeScanner";

// CSS
import styles from "./CameraPage.module.css";

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // ★ 1. フックから detectedCamera を受け取る
  const { isScanning, errorMessage, startScan, stopScan, detectedCamera } = useQRCodeScanner(videoRef);

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

  // ★ 2. detectedCamera が変更されたらアラートを表示する useEffect を追加
  useEffect(() => {
    if (detectedCamera) {
      // MediaDeviceInfoオブジェクトの情報を整形して表示
      const cameraInfo = `
        検出されたカメラ情報:
        ---------------------
        ラベル: ${detectedCamera.label}
        ID: ${detectedCamera.deviceId}
        グループID: ${detectedCamera.groupId}
      `;
      alert(cameraInfo);
    }
  }, [detectedCamera]); // detectedCamera が変更された時だけ実行

  return (
    <div className={styles.cameraPage}>
      {/* ... (JSX部分は変更なし) */}
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