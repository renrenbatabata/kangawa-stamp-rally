// React
import { useState } from "react";

// アセット（かめ太郎画像）
import kametaroWelcome from "../../assets/images/kametaro/welcome.png";
import kametaroCamera from "../../assets/images/kametaro/camera.png";
import kametaroMap from "../../assets/images/kametaro/map.png";
import kametaroComplete from "../../assets/images/kametaro/complete.png";

// CSS
import styles from "./Walkthrough.module.css";

interface WalkthroughProps {
  onComplete: () => void;
}

interface Step {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  altText: string;
}

const Walkthrough: React.FC<WalkthroughProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: "ようこそ！",
      description: "かながわく区民まつりデジタルスタンプラリーへようこそ！",
      content: "QRコードを読み取ってスタンプを集めよう！",
      imageUrl: kametaroWelcome,
      altText: "お出迎えするかめ太郎",
    },
    {
      title: "スタンプを集めよう",
      description: "会場に設置されたQRコードを読み取ってスタンプをゲット！",
      content: "各ポイントでクイズに答えるとスタンプがもらえるよ！",
      imageUrl: kametaroCamera,
      altText: "カメラを持つかめ太郎",
    },
    {
      title: "地図を見よう",
      description: "会場マップでスタンプポイントの場所を確認できます。",
      content: "地図をタップすると拡大表示されるよ！",
      imageUrl: kametaroMap,
      altText: "旅姿のかめ太郎",
    },
    {
      title: "スタンプを確認",
      description: "集めたスタンプはいつでも確認できます。",
      content: "全部集めて素敵な思い出を作ろう！",
      imageUrl: kametaroComplete,
      altText: "ガッツポーズのかめ太郎",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <button
          type="button"
          className={styles.skipButton}
          onClick={handleSkip}
          aria-label="チュートリアルをスキップ"
        >
          スキップ
        </button>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img
              src={steps[currentStep].imageUrl}
              alt={steps[currentStep].altText}
              className={styles.kametaroImage}
            />
          </div>

          <h2 className={styles.title}>{steps[currentStep].title}</h2>
          <p className={styles.description}>{steps[currentStep].description}</p>
          <p className={styles.contentText}>{steps[currentStep].content}</p>

          <div className={styles.dots}>
            {steps.map((step, index) => (
              <span
                key={step.title}
                className={`${styles.dot} ${
                  index === currentStep ? styles.activeDot : ""
                }`}
              />
            ))}
          </div>

          <div className={styles.buttonContainer}>
            {currentStep > 0 && (
              <button
                type="button"
                className={styles.prevButton}
                onClick={handlePrev}
              >
                戻る
              </button>
            )}
            <button
              type="button"
              className={styles.nextButton}
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? "はじめる" : "次へ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;

