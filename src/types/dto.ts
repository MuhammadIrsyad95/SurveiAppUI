// src/types/dto.ts

export interface CreateResponseDto {
  formId: string;
  respondentName: string;
  answers: AnswerDto[];
}

export interface AnswerDto {
  questionId: string;
  answerText?: string;
  choiceId?: string |  null;
}
