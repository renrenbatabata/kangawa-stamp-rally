import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CameraPage.module.css";
import Scanner from "../../components/common/Scanner/Scanner";
import UIOverlay from "../../components/common/UIOverlay/UIOverlay";

const CameraPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScanSuccess = useCallback(
    (data: string) => {
      console.log("QR Code detected:", data);
      setErrorMessage(null); // スキャン成功時はエラーをクリア
      setIsScanning(false);

      if (data.startsWith("stamp_point_")) {
        const stampId = data.split("_").pop();
        console.log("Stamp ID detected:", stampId);
        navigate("/quiz");
      } else {
        navigate("/scan/fail");
      }
    },
    [navigate]
  );

  const handleScanError = useCallback((message: string) => {
    setErrorMessage(message);
    setIsScanning(false);
  }, []);

  const handleRetry = useCallback(() => {
    setErrorMessage(null);
    setIsScanning(true);
  }, []);

  return (
    <div className={styles.cameraPage}>
      {!errorMessage && (
        <Scanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          isScanning={isScanning}
          setIsScanning={setIsScanning}
        />
      )}
      <UIOverlay
        isScanning={isScanning}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default CameraPage;