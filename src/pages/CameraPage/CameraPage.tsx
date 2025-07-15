// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./CameraPage.module.css";
// import CameraButton from "../../components/common/CamaraButton/CameraButton";

// // QRスキャンのライブラリのインポート
// import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser"
// import { Result } from '@zxing/library'

// const CameraPage: React.FC = () => {
//   const navigate = useNavigate();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null); // エラーメッセージ

//   // QRコードリーダーのインスタンス
//   const

//   // コンポーネトがマウントされた時とアンマウントされる時にカメラを制御
//   useEffect(() => {
//     //カメラ停止
//     return () => {
//       if (codeReader.current) {
//         codeReader.current.reset();
//       }
//     }
//   })

//   return (
//     <div className={styles.cameraPage}>
//       <CameraButton onClick={() => {}} />
//     </div>
//   );
// }

// export default CameraPage;
