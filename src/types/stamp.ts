export interface Stamp {
  stampNo: string;
  stampName: string;
  stampText: string;
  imgPath: string;
  quizDto: {
    quizNo: number;
    quizText: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answerNo: number;
    explanation: string;
  };
  date: string | null;
}
