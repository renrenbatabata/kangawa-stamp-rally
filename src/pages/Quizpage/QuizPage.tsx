import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./QuizPage.module.css";
import background from "../../assets/images/background.png";

const QuizPage: React.FC = () => {
  const navigate = useNavigate();

  // クイズのデータ仮（実際はAPIやデータベースから取得する）
  const postQuizData = {
    id: 1,
    question: "かながわ区の『区の木』はどんな木でしょうか？",
    options: ["さくら", "いちょう", "もみじ", "くすのき"],
    answer: "さくら", // 正解の選択肢
  };

  // クイズデータの型を定義
  type QuizData = {
    id: number;
    question: string;
    options: string[];
    answer: string;
  };

  // クイズデータの状態を管理（初期値を設定）
  const [quizData, setQuizData] = useState<QuizData>(postQuizData);

  // クイズデータを設定
  // ここでは仮のデータを使用、実際にはAPIから取得する。

  // ユーザーの選択肢を管理する
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // クイズが完了したかどうかを管理する
  const [quizCompleted, setQuizCompleted] = useState(false);

  // 正解かどうかを管理する
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // クイズの選択肢をクリックしたときのハンドラー
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    // 正解かどうかをチェック
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
            {/* 新しいdivで囲む */}
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
