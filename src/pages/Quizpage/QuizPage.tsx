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
      const isMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

      if (isMock) {
        try {
          console.log("モックデータを使用しています。");
          // public/data/quiz_mock.json ファイルをfetchで読み込む
          const response = await fetch('/data/quiz_mock.json');

          if (!response.ok) {
            throw new Error('モックデータの読み込みに失敗しました');
          }
          const data: QuizApiResponse = await response.json(); // ここで型を使用

          // 正しい修正：オプションを配列に変換する
          const options = [data.option1, data.option2, data.option3, data.option4];

          // JSONファイルから取得したデータをQuizDataの型に整形
          const formattedQuizData: QuizData = {
            id: data.quizNo,
            question: data.quizText,
            options: options, // 作成した options 配列を使用
            answer: options[data.answerNo - 1], // 作成した options 配列を使用
          };

          setQuizData(formattedQuizData);
        } catch (error) {
          console.error("モックデータの読み込みエラー:", error);
          // ユーザーにエラーを通知する状態を設定するのも良いでしょう
        }
        return;
      }

      // 本番環境: 実際のAPIを呼び出す
      try {
        const stampId = "stamp001"; //TODO 

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/quiz?stampId=${stampId}`);

        if (!response.ok) {
          // 提供された共通エラーレスポンスのような、200番台以外の応答を処理
          const errorData = await response.json();
          throw new Error(errorData.message || 'APIの取得に失敗しました');
        }

        const data: QuizApiResponse = await response.json(); // ここで型を使用

        const options = [data.option1, data.option2, data.option3, data.option4];
        const answer = options[data.answerNo - 1];

        const formattedQuizData = {
          id: data.quizNo,
          question: data.quizText,
          options: options,
          answer: answer,
        };

        setQuizData(formattedQuizData);
      } catch (error) {
        console.error("APIの取得に失敗しました:", error);
        // エラーメッセージをユーザーに表示するよう状態をセットすることも可能
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
        <div className={styles.quizOptions}>
          {quizData.options.map((option) => (
            <button
              key={quizData.id}
              type="button"
              className={`${styles.quizOption}
           ${selectedOption === option ? styles.selected : ""}
           `}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* 答えのメッセージ表示エリア */}
        {quizCompleted && (
          <div className={styles.answerDisplayArea}>
            {" "}
            <p
              className={`${styles.answerMessage} ${isCorrect ? styles.correct : styles.incorrect
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
            type="button"
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