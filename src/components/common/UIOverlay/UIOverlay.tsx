import React from "react";
import styles from "./UIOverlay.module.css";

interface UIOverlayProps {
  isScanning: boolean;
  errorMessage: string | null;
  onRetry: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  isScanning,
  errorMessage,
  onRetry,
}) => {
  return (
    <div className={styles.uiOverlay}>
      <div className={styles.speechBubble}>
        <p className={styles.bubbleText}>QRコードを よみこんでね！</p>
      </div>

      <div className={styles.cameraScanGuide}>
        {errorMessage && (
          <div className={styles.cameraErrorOverlay}>
            <p className={styles.errorText}>{errorMessage}</p>
            <button className={styles.retryButton} onClick={onRetry}>
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
  );
};

export default UIOverlay;