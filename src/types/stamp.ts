// src/types/stamp.ts

// -------------------------------------------------------------
// クイズデータ (QuizDto) の型定義
// -------------------------------------------------------------
export interface QuizDto {
  quizNo: number;
  quizText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answerNo: number;
  explanation: string;
}

// -------------------------------------------------------------
// スタンプデータ (Stamp) の型定義
// -------------------------------------------------------------
export interface Stamp {
  stampNo: string;
  stampName: string;
  stampText: string;
  stampSubName: string;
  imgPath: string;
  quizDto: QuizDto;
  date: string;
  [key: string]: unknown;
}

// -------------------------------------------------------------
// QuizPage で内部的に使う QuizData の型を定義
// -------------------------------------------------------------
export interface QuizData {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
