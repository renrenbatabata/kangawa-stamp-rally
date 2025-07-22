import styles from "./QuizPage.module.css";
import background from "../../assets/images/background.png";

const QuizPage: React.FC = () => {
  const quizData = {
    id: 1,
    question: "かながわ区の『区の木』はどんな木でしょうか？",
    options: ["さくら", "いちょう", "もみじ", "くすのき"],
    answer: "さくら", // 正解の選択肢
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
            <li key={index} className={styles.quizOption}>
              {option}
            </li>
          ))}
        </ul>

        <button className={styles.quizButton}>こたえをみる！</button>
      </div>
    </div>
  );
};

export default QuizPage;
