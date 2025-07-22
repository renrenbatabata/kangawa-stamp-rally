// src/pages/CameraPage/CameraPage.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser"; // IScannerControlsの型定義をインポート
import styles from "./CameraPage.module.css";

const CameraPage: React.FC = () => {
  const navigate = useNavigate(); // 画面遷移のためのフック
  const videoRef = useRef<HTMLVideoElement>(null); // カメラ映像を表示する<video>要素への参照
  const [isScanning, setIsScanning] = useState(false); // スキャン中かどうかを管理する状態
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // エラーメッセージを管理する状態

  const codeReader = useRef<BrowserQRCodeReader | null>(null); // BrowserQRCodeReaderのインスタンスを保持するref
  const [scannerControls, setScannerControls] =
    useState<IScannerControls | null>(null); // カメラ制御オブジェクトを保持する状態

  /**
   * QRコードスキャンを開始する非同期関数
   * この関数はuseCallbackでラップされており、依存関係が変更されない限り再生成されない
   */
  const startScan = useCallback(async () => {
    // videoRef.currentがnull（video要素がDOMにまだない）の場合は処理を中断
    if (!videoRef.current) return;

    // スキャン開始前にエラーメッセージをクリアし、スキャン中フラグを立てる
    setErrorMessage(null);
    setIsScanning(true);

    try {
      // BrowserQRCodeReaderのインスタンスがなければ新しく作成し、refに保存
      if (!codeReader.current) {
        codeReader.current = new BrowserQRCodeReader();
      }

      // 利用可能なビデオ入力デバイス（カメラ）のリストを取得
      const videoInputDevices =
        await BrowserQRCodeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        throw new Error("カメラが見つかりませんでした。");
      }

      // 最初のカメラデバイスIDを選択（`facingMode`を使用する場合は厳密には不要だが、互換性のため残す）
      const selectedDeviceId = videoInputDevices[0].deviceId;

      // カメラ映像をvideo要素に表示し、QRコードのデコードを開始
      // decodeFromVideoDeviceはIScannerControlsオブジェクトを返す
      const controls = await codeReader.current.decodeFromVideoDevice(
        // deviceIdはundefinedにして、facingModeヒントが優先されるようにする
        // もしくは、selectedDeviceId を指定して最初のカメラを明示的に使用
        selectedDeviceId, // ここで特定のdeviceIdを指定
        // undefined, // facingMode優先の場合はこちら

        videoRef.current, // 映像を表示する<video>要素
        (result, err) => {
          // デコード結果またはエラーのコールバック
          // QRコードが正常に検出された場合
          if (result) {
            console.log("QR Code detected:", result.getText());
            // QRコード検出後、すぐにカメラを停止してリソースを解放
            controls.stop();
            setIsScanning(false); // スキャン中状態を解除
            setScannerControls(null); // controlsをリセット

            // --- QRコードデータに基づく処理（ここが重要！） ---
            const qrData = result.getText();
            // 例: QRコードの内容が"stamp_point_"で始まる場合を成功とみなす
            if (qrData.startsWith("stamp_point_")) {
              // スタンプポイントのIDを抽出
              const stampId = qrData.split("_").pop();
              console.log("Stamp ID detected:", stampId);
              navigate("/quiz"); //クイズ画面答えたら→ 成功画面へ遷移

              // ここでQRコードの内容に基づく処理を追加することも可能
              //  スタンプポイントのIDを抽出してAPIに送信する
            } else {
              navigate("/scan/fail"); // 失敗画面へ遷移
            }
          }

          // エラーが発生したが、それが「QRコードが見つからない」というNotFoundExceptionでない場合
          if (err) {
            const isNotFoundError =
              err instanceof Error && err.name === "NotFoundException";
            if (!isNotFoundError) {
              console.error("QR Code Scan Error:", err);
            }
          }
        }
      );
      // IScannerControlsオブジェクトをstateに保存し、後でカメラを停止できるようにする
      setScannerControls(controls);
      console.log("Scanning started...");
    } catch (error: unknown) {
      // カメラ起動やアクセスに関するエラー処理
      setIsScanning(false); // スキャン中状態を解除
      setScannerControls(null); // エラー時もcontrolsをリセット
      console.error("Camera access error:", error);

      // エラーの種類に応じてユーザーフレンドリーなメッセージを設定
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        typeof (error as { name?: unknown }).name === "string"
      ) {
        const errName = (error as { name: string }).name;
        if (errName === "NotAllowedError" || errName === "NotFoundError") {
          setErrorMessage(
            "カメラへのアクセスが許可されていません。ブラウザの設定を確認してください。"
          );
        } else if (errName === "NotReadableError") {
          setErrorMessage(
            "カメラが使用中です。他のアプリを閉じてもう一度お試しください。"
          );
        } else {
          setErrorMessage(
            `カメラの起動に失敗しました: ${
              "message" in error &&
              typeof (error as { message?: unknown }).message === "string"
                ? (error as { message: string }).message
                : "不明なエラー" // messageプロパティがない場合も考慮
            }`
          );
        }
      } else {
        setErrorMessage("カメラの起動に失敗しました: 不明なエラー");
      }
    }
  }, [navigate]); // useCallbackの依存配列: navigateが変更された場合にのみstartScan関数が再生成される

  /**
   * カメラの自動起動とエラーからの再試行を制御するuseEffect
   * コンポーネントがマウントされたとき、およびエラー解除時にカメラを起動する
   */
  useEffect(() => {
    // スキャン中でなく、かつエラーメッセージがない場合にのみスキャンを開始
    if (!isScanning && !errorMessage) {
      startScan();
    }
    return () => {}; // 空のクリーンアップ関数
  }, [startScan, isScanning, errorMessage]); // 依存配列: startScan, isScanning, errorMessageの変更を監視

  /**
   * コンポーネントのアンマウント時にカメラリソースを確実に解放するuseEffect
   * scannerControlsが変更された時にも、前のストリームを停止するために監視
   */
  useEffect(() => {
    return () => {
      // ページを離れる際にカメラを停止
      if (scannerControls) {
        scannerControls.stop();
        console.log("QR Code Reader stopped via controls (component unmount)");
      }
      // BrowserQRCodeReaderインスタンスを破棄（メモリリーク防止、オプション）
      if (codeReader.current) {
        codeReader.current = null;
      }
    };
  }, [scannerControls]); // 依存配列: scannerControlsの変更を監視

  return (
    <div className={styles.cameraPage}>
      {/* カメラ映像を全画面背景として表示するvideo要素 */}
      {!errorMessage && (
        <video
          ref={videoRef} // video要素への参照を設定
          className={styles.cameraBackground} // 全画面背景用のCSSクラス
          playsInline // iOS Safariなどで動画がインラインで再生されるようにする
          autoPlay // 自動再生
          muted // 音声なし（自動再生の要件を満たすため）
        />
      )}

      {/* UI要素を重ねるためのオーバーレイコンテナ */}
      <div className={styles.uiOverlay}>
        {/* 吹き出しメッセージ */}
        <div className={styles.speechBubble}>
          <p className={styles.bubbleText}>QRコードを よみこんでね！</p>
        </div>

        {/* カメラプレビューエリア（QRコードのガイド枠として機能） */}
        <div className={styles.cameraScanGuide}>
          {errorMessage && ( // エラーがある場合のみエラーオーバーレイを表示
            <div className={styles.cameraErrorOverlay}>
              <p className={styles.errorText}>{errorMessage}</p>
              <button className={styles.retryButton} onClick={startScan}>
                再試行
              </button>
            </div>
          )}
        </div>

        {/* カメラボタンコンテナ */}
        <div className={styles.buttonContainer}>
          {/* スキャン中のメッセージ表示 */}
          {isScanning && !errorMessage && (
            <p className={styles.scanningMessage}>スキャン中...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
