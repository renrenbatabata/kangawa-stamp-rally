import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import styles from "./QuizPage.module.css";
import background from "../../assets/images/background.png";
import type { Stamp } from "../../types/stamp";
import { useState } from "react";
interface QuizData {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const stampDataFromState = location.state?.stampData as Stamp;
  const initialQuizData: QuizData = stampDataFromState
    ? {
        id: stampDataFromState.quizDto.quizNo,
        question: stampDataFromState.quizDto.quizText,
        options: [
          stampDataFromState.quizDto.option1,
          stampDataFromState.quizDto.option2,
          stampDataFromState.quizDto.option3,
          stampDataFromState.quizDto.option4,
        ],
        answer: stampDataFromState.quizDto.answerNo,
        explanation: stampDataFromState.quizDto.explanation,
      }
    : {
        id: 0,
        question: "",
        options: [],
        answer: 1,
        explanation: "",
      };
  const [quizData] = useState<QuizData>(initialQuizData);
  if (!stampDataFromState) {
    navigate("/error");
    return null;
  }
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    const selectedIndex = quizData.options.indexOf(option) + 1;
    if (selectedIndex === quizData.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };
  const handleQuizComplete = () => {
    if (selectedOption) {
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
              className={`${styles.quizOption}
                ${selectedOption === option ? styles.selected : ""}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {quizCompleted && (
          <div className={styles.answerDisplayArea}>
            <p
              className={`${styles.answerMessage} ${
                isCorrect ? styles.correct : styles.incorrect
              }`}
            >
              {isCorrect ? (
                "せいかい！🎉"
              ) : (
                <div>
                  <p>ざんねん！</p>
                  <p>正解は「{quizData.options[quizData.answer - 1]}」だよ！</p>
                  <span className={styles.explanation}>
                    {quizData.explanation}
                  </span>
                </div>
              )}
            </p>
          </div>
        )}
        {!quizCompleted && (
          <button
            type="button"
            className={styles.quizButton}
            onClick={handleQuizComplete}
          >
            こたえをみる！
          </button>
        )}
        {quizCompleted && (
          <button
            type="button"
            className={styles.quizButton}
            onClick={() => navigate("/scan/success")}
          >
            スタンプをもらう！
          </button>
        )}
      </div>
    </div>
  );
};
export default QuizPage;