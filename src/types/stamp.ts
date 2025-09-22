// src/types/stamp.ts

// APIから返される各スタンプオブジェクトの型を定義
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
  date: string | null; // スタンプが押されていない場合はnullになる可能性がある
}