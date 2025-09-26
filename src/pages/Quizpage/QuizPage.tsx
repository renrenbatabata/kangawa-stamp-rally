import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "./QuizPage.module.css";
import background from "../../assets/images/background.png";
import type { Stamp, QuizData } from "../../types/stamp";
import { useState, useEffect } from "react";

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const stampData = location.state?.stampData;
    if (stampData) {
      console.log("スタンプデータが正常に渡されました:", stampData);
    } else {
      console.error("スタンプデータ (stampData) が渡されていません！");
    }
  }, [location]);

  const stampDataFromState = location.state?.stampData as Stamp | undefined;

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

  if (!stampDataFromState || !stampDataFromState.quizDto) {
    navigate("/error", { replace: true });
    return null;
  }

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
            onClick={() =>
              navigate("/scan/success", {
                state: { stampData: stampDataFromState },
              })
            }
          >
            スタンプをもらう！
          </button>
        )}
      </div>
    </div>
  );
};
export default QuizPage;
