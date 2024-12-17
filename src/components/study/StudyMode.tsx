import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Flashcard } from '../../types';
import { FlashCard } from '../FlashCard';
import { useStore } from '../../store/useStore';
import { ProgressTracker } from './ProgressTracker';

interface StudyModeProps {
  onClose: () => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({ onClose }) => {
  const flashcards = useStore((state) => state.getFlashcardsForReview());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Verifica se há flashcards disponíveis
  if (flashcards.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col items-center justify-center">
        <h2 className="text-white">Nenhum flashcard disponível para revisão.</h2>
        <button onClick={onClose} className="mt-4 px-4 py-2 rounded-full bg-[#1DB954] text-white">
          Voltar
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const updateFlashcard = useStore((state) => state.updateFlashcard);
  const updateStats = useStore((state) => state.updateStats); // Obtém a função de atualização de estatísticas

  const handleNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, flashcards.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleResult = (correct: boolean) => {
    updateFlashcard(currentCard.id, correct);
    updateStats(correct); // Atualiza as estatísticas
    handleNext();
  };

  return (
    <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-[#282828]">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full hover:bg-[#282828] text-white transition-colors"
        >
          Sair do Modo de Estudo
        </button>
        <div className="text-white">
          Cartão {currentIndex + 1} de {flashcards.length}
        </div>
      </div>

      <ProgressTracker />

      <div className="flex-1 flex items-center justify-center p-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full hover:bg-[#282828] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-3xl mx-4">
          <AnimatePresence mode="wait">
            <FlashCard
              key={currentCard.id}
              front={currentCard.front}
              back={currentCard.back}
              onResult={handleResult}
            />
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="p-2 rounded-full hover:bg-[#282828] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
