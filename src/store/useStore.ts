import { create } from 'zustand';
import { User, Deck, Flashcard, StudyStats, Settings } from '../types';

interface AppState {
  user: User | null;
  decks: Deck[];
  flashcards: Flashcard[];
  stats: StudyStats;
  isDarkMode: boolean;
  settings: Settings;
  setUser: (user: User | null) => void;
  loginAsAdmin: () => void;
  logoutUser: () => void;
  addDeck: (deck: Deck) => void;
  removeDeck: (deckId: string) => void;
  updateDeck: (deck: Deck) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  removeFlashcard: (flashcardId: string) => void;
  updateFlashcard: (id: string, correct: boolean, nextReview: Date) => void;
  updateStats: (correct: boolean) => void;
  toggleDarkMode: () => void;
  addDeckTopic: (topic: string) => void;
  removeDeckTopic: (topic: string) => void;
  addCardTag: (tag: string) => void;
  removeCardTag: (tag: string) => void;
  getFlashcardsForReview: () => Flashcard[];
  getDeckById: (deckId: string) => Deck | undefined;
  getFlashcardsByDeckId: (deckId: string) => Flashcard[];
}

export const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  user: null,
  decks: [],
  flashcards: [],
  stats: {
    cardsReviewed: 0,
    correctAnswers: 0,
    studyTime: 0,
    lastStudyDate: new Date(),
    streaks: []
  },
  isDarkMode: true,
  settings: {
    deckTopics: ['Programação', 'Idiomas', 'Matemática', 'Ciências'],
    cardTags: ['Importante', 'Revisão', 'Conceito', 'Exemplo'],
  },

  // Ações de autenticação
  setUser: (user) => set({ user }),
  
  loginAsAdmin: () => set({
    user: {
      id: 'admin-1',
      name: 'Administrador',
      email: 'admin@flashmaster.com',
      role: 'admin'
    }
  }),

  logoutUser: () => set({ user: null }),

  // Ações de baralhos
  addDeck: (deck) => set((state) => ({ 
    decks: [...state.decks, deck] 
  })),

  removeDeck: (deckId) => set((state) => ({
    decks: state.decks.filter(deck => deck.id !== deckId),
    flashcards: state.flashcards.filter(card => card.deckId !== deckId)
  })),

  updateDeck: (updatedDeck) => set((state) => ({
    decks: state.decks.map(deck => 
      deck.id === updatedDeck.id ? updatedDeck : deck
    )
  })),

  // Ações de flashcards
  addFlashcard: (flashcard) => set((state) => ({ 
    flashcards: [...state.flashcards, flashcard] 
  })),

  removeFlashcard: (flashcardId) => set((state) => ({
    flashcards: state.flashcards.filter(card => card.id !== flashcardId)
  })),

  updateFlashcard: (id, correct, nextReview) => set((state) => {
    const flashcards = state.flashcards.map((flashcard) => {
      if (flashcard.id === id) {
        const streak = correct ? (flashcard.streak || 0) + 1 : 0;
        return { 
          ...flashcard, 
          nextReview, 
          streak,
          lastReviewed: new Date()
        };
      }
      return flashcard;
    });
    return { flashcards };
  }),

  // Ações de estatísticas
  updateStats: (correct: boolean) => set((state) => {
    const now = new Date();
    const cardsReviewed = state.stats.cardsReviewed + 1;
    const correctAnswers = correct ? state.stats.correctAnswers + 1 : state.stats.correctAnswers;
    const studyTime = state.stats.studyTime + 
      (now.getTime() - new Date(state.stats.lastStudyDate).getTime()) / 1000;

    return { 
      stats: { 
        ...state.stats, 
        cardsReviewed, 
        correctAnswers,
        studyTime,
        lastStudyDate: now,
        streaks: [...state.stats.streaks, correct ? 1 : 0]
      } 
    };
  }),

  // Ações de tema
  toggleDarkMode: () => set((state) => ({ 
    isDarkMode: !state.isDarkMode 
  })),

  // Ações de configurações
  addDeckTopic: (topic: string) => set((state) => ({
    settings: {
      ...state.settings,
      deckTopics: [...new Set([...state.settings.deckTopics, topic])]
    }
  })),

  removeDeckTopic: (topic: string) => set((state) => ({
    settings: {
      ...state.settings,
      deckTopics: state.settings.deckTopics.filter(t => t !== topic)
    }
  })),

  addCardTag: (tag: string) => set((state) => ({
    settings: {
      ...state.settings,
      cardTags: [...new Set([...state.settings.cardTags, tag])]
    }
  })),

  removeCardTag: (tag: string) => set((state) => ({
    settings: {
      ...state.settings,
      cardTags: state.settings.cardTags.filter(t => t !== tag)
    }
  })),

  // Métodos de consulta
  getFlashcardsForReview: () => {
    const flashcards = get().flashcards;
    const now = new Date();
    return flashcards.filter(flashcard => {
      return !flashcard.nextReview || new Date(flashcard.nextReview) <= now;
    });
  },

  getDeckById: (deckId: string) => {
    return get().decks.find(deck => deck.id === deckId);
  },

  getFlashcardsByDeckId: (deckId: string) => {
    return get().flashcards.filter(card => card.deckId === deckId);
  }
}));
