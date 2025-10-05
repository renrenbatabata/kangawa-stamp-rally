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
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // ピンチズーム用の状態
  const lastTouchDistance = useRef<number | null>(null);
  const lastScale = useRef(1);

  // タッチ間の距離を計算
  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // ピンチズーム開始
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      lastTouchDistance.current = distance;
      lastScale.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      setStartPos({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  // ピンチズーム中
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      const ratio = distance / lastTouchDistance.current;
      const newScale = Math.min(Math.max(1, lastScale.current * ratio), 4);
      setScale(newScale);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - startPos.x,
        y: e.touches[0].clientY - startPos.y,
      });
    }
  };

  // ピンチズーム終了
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
      // スケールが1の場合、位置をリセット
      if (scale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  // マウスイベント（PC用）
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ホイールズーム（PC用）
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(1, scale * delta), 4);
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // ダブルタップでズーム
  const lastTap = useRef<number>(0);
  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      if (scale > 1) {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(2);
      }
    }
    lastTap.current = now;
  };

  return (
    <div className={styles.zoomedOverlay} onClick={onClose}>
      <button 
        type="button" 
        className={styles.closeButton} 
        onClick={onClose} 
        aria-label={`${imageAlt}を閉じる`}
      >
        &times;
      </button>
      
      <div 
        className={styles.zoomedMapContainer} 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={(e) => {
          e.stopPropagation();
          handleDoubleTap(e);
        }}
      >
        <img
          ref={imageRef}
          src={imageSrc}
          alt={imageAlt}
          className={styles.zoomedMapImage}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          draggable={false}
        />
      </div>
      
      {scale > 1 && (
        <div className={styles.zoomIndicator}>
          {Math.round(scale * 100)}%
        </div>
      )}
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
