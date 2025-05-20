// src/types/types.ts
import { QuestionType } from './enums';

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
  questions?: Question[];
  responses?: Response[];
}
