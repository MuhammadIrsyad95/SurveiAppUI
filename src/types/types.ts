// src/types/types.ts

export type QuestionType =
  | "text"
  | "paragraph"
  | "multiple-choice"
  | "checkbox"
  | "number"
  | "date"
  | "time"
  | "dropdown";


export interface Choice {
  id: string;
  questionId: string;
  text: string;
}

export interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  choiceId?: string | null;
  answerText?: string | null;
  choice?: Choice;
}

export interface Question {
  id: string;
  formId: string;
  text: string;
  type: QuestionType;
  isRequired: boolean;
  choices?: Choice[];
  answers?: Answer[];
}

export interface Response {
  id: string;
  formId: string;
  respondentName: string;
  submittedAt: string;
  answers: Answer[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  imageUrl?: string | null;
  questions?: Question[];
  responses?: Response[];
}
