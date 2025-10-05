import { useRef, useEffect, useState } from 'react';
import Header from "../../components/common/Header/Header";
import FooterNav from "../../components/common/FooterNav/FooterNav";
import styles from "./MapPage.module.css";
import mapImage from "../../assets/images/map.png";
import ProgramImage from "../../assets/images/program.png";

interface ZoomedMapOverlayProps {
  imageSrc: string; 
  imageAlt: string; 
  onClose: () => void;
}

const ZoomedMapOverlay: React.FC<ZoomedMapOverlayProps> = ({ imageSrc, imageAlt, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (container) {
      const scrollX = (container.scrollWidth - container.clientWidth) / 2;
      const scrollY = (container.scrollHeight - container.clientHeight) / 2;
      
      container.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: 'smooth' 
      });
    }
  }, []); 

  return (
    <div className={styles.zoomedOverlay}>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label={`${imageAlt}を閉じる`}>
        &times;
      </button>
      
      <div className={styles.zoomedMapContainer} ref={mapRef}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={styles.zoomedMapImage}
          style={{ touchAction: 'pan-x pan-y' }}
        />
      </div>
    </div>
  );
};

const MapPage: React.FC = () => {
  const [isMapZoomed, setIsMapZoomed] = useState(false);
  const [isProgramZoomed, setIsProgramZoomed] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMapClick = () => {
    setIsMapZoomed(true);
  };

  const handleProgramClick = () => {
    setIsProgramZoomed(true);
  };
  
  const handleCloseZoom = () => {
    setIsMapZoomed(false);
    setIsProgramZoomed(false);
  };
  
  useEffect(() => {
    const container = mapContainerRef.current;
    
    if (container) {
      const scrollX = (container.scrollWidth - container.clientWidth) / 2;
      const scrollY = (container.scrollHeight - container.clientHeight) / 2;
      
      container.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: 'smooth' 
      });
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.contentArea}>
        <h1>会場情報</h1>
        
        <h2>会場マップ</h2>
        <div className={styles.mapContainer} ref={mapContainerRef}>
          <button
            type="button"
            aria-label="会場マップを拡大"
            className={styles.imageWrapper}
            onClick={handleMapClick}
          >
            <img
              src={mapImage}
              alt="会場マップ"
              className={styles.mapImage}
            />
          </button>
        </div>

        <h2>プログラム</h2>
        <div className={styles.mapContainer}>
          <button
            type="button"
            aria-label="プログラムを拡大"
            className={styles.imageWrapper}
            onClick={handleProgramClick}
          >
            <img
              src={ProgramImage}
              alt="プログラム"
              className={styles.mapImage}
            />
          </button>
        </div>
      </div>
      
      {isMapZoomed && (
        <ZoomedMapOverlay 
          imageSrc={mapImage} 
          imageAlt="拡大会場マップ" 
          onClose={handleCloseZoom} 
        />
      )}
      
      {isProgramZoomed && (
        <ZoomedMapOverlay 
          imageSrc={ProgramImage} 
          imageAlt="拡大プログラム" 
          onClose={handleCloseZoom} 
        />
      )}

      <FooterNav homePath="/stamps" cameraPath="/scan" mapPath="/map" />
    </div>
  );
};

export default MapPage;