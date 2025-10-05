// React
import { useState, useEffect } from "react";

// サードパーティ
import { useNavigate, useLocation } from "react-router-dom";

// 内部モジュール
import { useUserContext } from "../../hooks/useContext";
import type { Stamp, QuizData } from "../../types/stamp";

// アセット
import background from "../../assets/images/background.png";

// CSS
import styles from "./QuizPage.module.css";

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const uuid = useUserContext();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stampDataFromState = location.state?.stampData as Stamp | undefined;

  // データがない場合のリダイレクト処理をuseEffect内で実行
  useEffect(() => {
    const stampData = location.state?.stampData;
    if (!stampData) {
      // データがない場合はカメラページにリダイレクト
      navigate("/scan", { replace: true });
    }
  }, [location, navigate]);

  const quizDto = stampDataFromState?.quizDto;
  const initialQuizData: QuizData = quizDto
    ? {
        id: quizDto.quizNo,
        question: quizDto.quizText,
        options: [
          quizDto.option1,
          quizDto.option2,
          quizDto.option3,
          quizDto.option4,
        ],
        answer: quizDto.answerNo,
        explanation: quizDto.explanation,
      }
    : {
        id: 0,
        question: "",
        options: ["", "", "", ""],
        answer: 1,
        explanation: "",
      };

  const [quizData] = useState<QuizData>(initialQuizData);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleQuizComplete = () => {
    if (selectedOption) {
      const selectedIndex = quizData.options.indexOf(selectedOption) + 1;

      if (selectedIndex === quizData.answer) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
      setQuizCompleted(true);
    } else {
      alert("選択肢を選んでください！");
    }
  };

  const handleGetStamp = async () => {
    if (!stampDataFromState) return;
    
    setIsSubmitting(true);
    const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const stampId = stampDataFromState.stampNo;

    try {
      if (USE_MOCK_DATA) {
        // モックモードの場合、既に取得しているデータをそのまま使用
        console.log("スタンプ登録モック成功:", stampDataFromState);
        navigate("/scan/success", {
          state: { stampData: stampDataFromState },
        });
      } else {
        if (!apiBaseUrl) {
          throw new Error("API base URL is not configured.");
        }
        const apiUrl = `${apiBaseUrl}/add`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid, stampId }),
        });

        if (response.ok) {
          const stampDataFromApi = await response.json();
          console.log("スタンプ登録成功:", stampDataFromApi);
          navigate("/scan/success", {
            state: { stampData: stampDataFromApi },
          });
        } else {
          console.error(
            "スタンプ登録失敗:",
            response.status,
            await response.text()
          );
          navigate("/scan/fail");
        }
      }
    } catch (apiError) {
      console.error("API呼び出し中にエラーが発生しました:", apiError);
      navigate("/scan/fail");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.quizPage}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.quizContent}>
        <h1 className={styles.quizTitle}>かながわくクイズ</h1>
        <h2 className={styles.quizQuestion}>{quizData.question}</h2>
        <div className={styles.quizOptions}>
          {quizData.options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.quizOption} ${
                selectedOption === option ? styles.selected : ""
              } ${
                quizCompleted &&
                quizData.options.indexOf(option) + 1 === quizData.answer
                  ? styles.correctAnswer
                  : ""
              } ${styles.quizOptionWrapper} ${
                quizCompleted && !isCorrect && selectedOption === option
                  ? styles.wrongAnswer
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {quizCompleted && (
          <div className={styles.answerDisplayArea}>
            <div
              className={`${styles.answerMessage} ${
                isCorrect ? styles.correct : styles.incorrect
              }`}
            >
              {isCorrect ? (
                <div>
                  せいかい！🎉
                <span className={styles.explanation}>
                    {quizData.explanation}
                  </span>
                </div>

              ) : (
                <div>
                  <p>ざんねん！</p>
                  <p>正解は「{quizData.options[quizData.answer - 1]}」だよ！</p>
                  <span className={styles.explanation}>
                    {quizData.explanation}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {!quizCompleted && (
          <button
            type="button"
            className={styles.quizButton}
            onClick={handleQuizComplete}
            disabled={!selectedOption}
          >
            こたえをみる！
          </button>
        )}
        {quizCompleted && (
          <button
            type="button"
            className={styles.quizButton}
            onClick={handleGetStamp}
            disabled={isSubmitting}
          >
            スタンプをもらう！
          </button>
        )}
      </div>
    </div>
  );
};
export default QuizPage;
