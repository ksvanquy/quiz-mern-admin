export interface AttemptAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
}

export interface Attempt {
  _id?: string;
  userId: string;
  assessmentId: string;
  startedAt?: string;
  finishedAt?: string | null;
  totalScore: number;
  answers: AttemptAnswer[];
  createdAt?: string;
  updatedAt?: string;
}


