export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  lastReviewed?: Date;
  box: number; // Número da caixa do sistema Leitner (1-5)
  nextReview?: Date; // Data da próxima revisão
  streak?: number; // Sequência de acertos
}

export interface Deck {
  id: string;
  name: string;
  category: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyStats {
  cardsReviewed: number;
  correctAnswers: number;
  studyTime: number;
  lastStudyDate: Date;
}
