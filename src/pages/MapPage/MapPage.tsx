// React
import { useRef, useEffect, useState } from 'react';

// 内部モジュール
import Header from "../../components/common/Header/Header";
import FooterNav from "../../components/common/FooterNav/FooterNav";
import { showWalkthroughEvent } from "../../utils/walkthroughEvents";

// アセット
import mapImage from "../../assets/images/map.png";
import ProgramImage from "../../assets/images/program.png";

// CSS
import styles from "./MapPage.module.css";

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
  const handleDoubleTap = () => {
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
          handleDoubleTap();
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCameraHelp, setShowCameraHelp] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

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

  const handleShowWalkthrough = () => {
    showWalkthroughEvent();
  };

  const handleResetData = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    // LocalStorageのデータをクリア
    localStorage.clear();
    
    // ページをリロードして初期状態に戻す
    window.location.href = '/';
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleShowCameraHelp = async () => {
    // カメラ権限の状態を確認
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');
      } else {
        setCameraPermission('unknown');
      }
    } catch {
      setCameraPermission('unknown');
    }
    setShowCameraHelp(true);
  };

  const handleCloseCameraHelp = () => {
    setShowCameraHelp(false);
  };

  const handleRequestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // 権限取得成功
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
      alert('カメラの使用が許可されました！');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraPermission('denied');
          alert('カメラの使用が拒否されました。ブラウザの設定から許可してください。');
        }
      }
    }
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

        <h2>その他</h2>
        <div className={styles.settingsContainer}>
          <button
            type="button"
            className={styles.settingsButton}
            onClick={handleShowWalkthrough}
          >
            <span className={styles.settingsIcon}>💡</span>
            <div className={styles.settingsContent}>
              <h3 className={styles.settingsTitle}>使い方ガイド</h3>
              <p className={styles.settingsDescription}>
                アプリの使い方をもう一度確認する
              </p>
            </div>
            <span className={styles.settingsArrow}>›</span>
          </button>

          <button
            type="button"
            className={styles.settingsButton}
            onClick={handleShowCameraHelp}
          >
            <span className={styles.settingsIcon}>📷</span>
            <div className={styles.settingsContent}>
              <h3 className={styles.settingsTitle}>カメラ設定</h3>
              <p className={styles.settingsDescription}>
                カメラの使用許可を確認・設定する
              </p>
            </div>
            <span className={styles.settingsArrow}>›</span>
          </button>

          <button
            type="button"
            className={`${styles.settingsButton} ${styles.dangerButton}`}
            onClick={handleResetData}
          >
            <span className={styles.settingsIcon}>🗑️</span>
            <div className={styles.settingsContent}>
              <h3 className={styles.settingsTitle}>データリセット</h3>
              <p className={styles.settingsDescription}>
                全てのデータを削除して最初からやり直す
              </p>
            </div>
            <span className={styles.settingsArrow}>›</span>
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

      {showCameraHelp && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <h2 className={styles.cameraHelpTitle}>📷 カメラ設定</h2>
            
            <div className={styles.cameraStatus}>
              <p className={styles.statusLabel}>現在の状態：</p>
              {cameraPermission === 'granted' && (
                <span className={styles.statusGranted}>✅ 許可されています</span>
              )}
              {cameraPermission === 'denied' && (
                <span className={styles.statusDenied}>❌ 拒否されています</span>
              )}
              {cameraPermission === 'prompt' && (
                <span className={styles.statusPrompt}>⏸️ 未設定</span>
              )}
              {cameraPermission === 'unknown' && (
                <span className={styles.statusUnknown}>❓ 確認できません</span>
              )}
            </div>

            <div className={styles.cameraHelpContent}>
              <h3>カメラが使えない場合</h3>
              
              <div className={styles.helpSection}>
                <h4>📱 スマートフォンの場合</h4>
                <ol>
                  <li>ブラウザのアドレスバーにある🔒をタップ</li>
                  <li>「カメラ」を「許可」に変更</li>
                  <li>ページを再読み込み</li>
                </ol>
              </div>

              <div className={styles.helpSection}>
                <h4>💻 パソコンの場合</h4>
                <ol>
                  <li>ブラウザのアドレスバー左側のアイコンをクリック</li>
                  <li>「カメラ」の設定を「許可」に変更</li>
                  <li>ページを再読み込み</li>
                </ol>
              </div>
            </div>

            <div className={styles.confirmButtons}>
              {(cameraPermission === 'prompt' || cameraPermission === 'unknown') && (
                <button
                  type="button"
                  className={styles.resetButton}
                  onClick={handleRequestCamera}
                >
                  カメラを許可する
                </button>
              )}
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCloseCameraHelp}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog}>
            <h2 className={styles.confirmTitle}>データをリセットしますか？</h2>
            <p className={styles.confirmMessage}>
              この操作を実行すると、以下のデータが全て削除されます：
            </p>
            <ul className={styles.confirmList}>
              <li>獲得したスタンプ</li>
              <li>ユーザーID</li>
              <li>ウォークスルー表示状態</li>
              <li>その他の保存データ</li>
            </ul>
            <p className={styles.confirmWarning}>
              ⚠️ この操作は取り消せません
            </p>
            <div className={styles.confirmButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancelReset}
              >
                キャンセル
              </button>
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleConfirmReset}
              >
                リセットする
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterNav homePath="/stamps" cameraPath="/scan" mapPath="/map" />
    </div>
  );
};

export default MapPage;
