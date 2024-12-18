export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  box: number;
  nextReview: Date | null;
  streak: number;
  lastReviewed: Date | null;
  tags?: string[];
  difficulty?: 'Fácil' | 'Médio' | 'Difícil';
  metadata?: {
    bloomLevel?: 'Lembrar' | 'Entender' | 'Aplicar' | 'Analisar' | 'Avaliar' | 'Criar';
    source?: string;
    notes?: string;
  };
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
  streaks: number[];
}

export interface Settings {
  deckTopics: string[];
  cardTags: string[];
}

export interface BatchImportData {
  deck: {
    name: string;
    category: string;
  };
  flashcards: Array<{
    front: string;
    back: string;
    tags?: string[];
    difficulty?: 'Fácil' | 'Médio' | 'Difícil';
    metadata?: {
      bloomLevel?: 'Lembrar' | 'Entender' | 'Aplicar' | 'Analisar' | 'Avaliar' | 'Criar';
      source?: string;
      notes?: string;
    };
  }>;
}
