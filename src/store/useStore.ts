import { create } from 'zustand';
import { User, Deck, Flashcard, StudyStats } from '../types';

interface AppState {
  user: User | null;
  decks: Deck[];
  flashcards: Flashcard[];
  stats: StudyStats;
  isDarkMode: boolean;
  setUser: (user: User | null) => void;
  addDeck: (deck: Deck) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  updateStats: (correct: boolean) => void;
  toggleDarkMode: () => void;
  updateFlashcard: (id: string, correct: boolean) => void;
  getFlashcardsForReview: () => Flashcard[];
  initializeExampleData: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  decks: [],
  flashcards: [],
  stats: {
    cardsReviewed: 0,
    correctAnswers: 0,
    studyTime: 0,
    lastStudyDate: new Date(),
  },
  isDarkMode: true,
  setUser: (user) => set({ user }),
  addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),
  addFlashcard: (flashcard) =>
    set((state) => ({ flashcards: [...state.flashcards, flashcard] })),
  updateStats: (correct) => set((state) => {
    const cardsReviewed = state.stats.cardsReviewed + 1;
    const correctAnswers = correct ? state.stats.correctAnswers + 1 : state.stats.correctAnswers;
    return { stats: { ...state.stats, cardsReviewed, correctAnswers } };
  }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  updateFlashcard: (id, correct) => set((state) => {
    const flashcards = state.flashcards.map((flashcard) => {
      if (flashcard.id === id) {
        const nextReview = correct
          ? new Date(Date.now() + 86400000)
          : new Date(Date.now() + 3600000);
        const streak = correct ? (flashcard.streak || 0) + 1 : 0;
        return { ...flashcard, nextReview, streak };
      }
      return flashcard;
    });
    return { flashcards };
  }),
  getFlashcardsForReview: () => {
    const flashcards = get().flashcards;
    const now = new Date();
    return flashcards.filter(flashcard => {
      return !flashcard.nextReview || flashcard.nextReview <= now;
    });
  },
  initializeExampleData: () => {
    const exampleDecks = [
      { id: 'deck1', name: 'Idiomas', category: 'Idiomas', userId: '1', createdAt: new Date(), updatedAt: new Date() },
      { id: 'deck2', name: 'Matemática', category: 'Matemática', userId: '1', createdAt: new Date(), updatedAt: new Date() },
    ];

    const exampleFlashcards = [
      { id: 'card1', front: 'Como se diz "Hello" em espanhol?', back: 'Hola', deckId: 'deck1', box: 1, nextReview: new Date(Date.now() + 86400000), streak: 0 },
      { id: 'card2', front: 'Qual é a capital da França?', back: 'Paris', deckId: 'deck2', box: 1, nextReview: new Date(Date.now() + 86400000), streak: 0 },
      { id: 'card3', front: 'Qual é 2 + 2?', back: '4', deckId: 'deck2', box: 1, nextReview: new Date(Date.now() + 86400000), streak: 0 },
    ];

    set({ decks: exampleDecks, flashcards: exampleFlashcards });
  },
}));

// Chame a função initializeExampleData em algum lugar apropriado, como no início da aplicação
useStore.getState().initializeExampleData();
