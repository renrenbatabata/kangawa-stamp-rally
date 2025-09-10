import React from "react";
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";

import styles from "./QuizPage.module.css";
import background from "../../assets/images/background.png";

// APIレスポンスの型を定義
interface QuizApiResponse {
  quizNo: number;
  quizText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answerNo: number;
  explanation: string;
}

// クイズデータの型を定義
interface QuizData {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch('/quiz?stampId=stamp001'); 
        if (!response.ok) {
          throw new Error('APIの取得に失敗しました');
        }
        const data: QuizApiResponse = await response.json();

        const options = [data.option1, data.option2, data.option3, data.option4];
        const answer = options[data.answerNo - 1]; 

        const formattedQuizData: QuizData = {
          id: data.quizNo,
          question: data.quizText,
          options: options,
          answer: answer,
        };

        setQuizData(formattedQuizData);
      } catch (error) {
        console.error("APIの取得に失敗しました:", error);
        const postQuizData: QuizData = {
          id: 1,
          question: "かながわ区の『区の木』はどんな木でしょうか？",
          options: ["さくら", "いちょう", "もみじ", "くすのき"],
          answer: "さくら",
        };
        setQuizData(postQuizData);
      }
    };

    fetchQuiz();
  }, []); 

  if (!quizData) {
    return <div>よみこみ中...</div>;
  }

  // クイズの選択肢をクリックしたときのハンドラー
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (option === quizData.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  // クイズが完了したときのハンドラー
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
        <h1 className={styles.quizTitle}>💡かながわくクイズ</h1>
        <h2 className={styles.quizQuestion}>{quizData.question}</h2>
        <ul className={styles.quizOptions}>
          {quizData.options.map((option, index) => (
            <li
              key={index}
              className={`${styles.quizOption}
           ${selectedOption === option ? styles.selected : ""}
           `}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>

        {/* 答えのメッセージ表示エリア */}
        {quizCompleted && (
          <div className={styles.answerDisplayArea}>
            {" "}
            <p
              className={`${styles.answerMessage} ${
                isCorrect ? styles.correct : styles.incorrect
              }`}
            >
              {isCorrect ? (
                "せいかい！🎉"
              ) : (
                <>
                  ざんねん！
                  <br />
                  正解は「{quizData.answer}」です。
                </>
              )}
            </p>
          </div>
        )}
        {/* クイズ完了ボタン */}

        {!quizCompleted && (
          <button
            className={styles.quizButton}
            onClick={() => {
              handleQuizComplete();
            }}
          >
            こたえをみる！
          </button>
        )}
        {quizCompleted && (
          <button
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