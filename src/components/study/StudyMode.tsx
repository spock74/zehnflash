import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Flashcard } from '../../types';
import { FlashCard } from '../FlashCard';
import { useStore } from '../../store/useStore';
import { StudyProgress } from './StudyProgress';

interface StudyModeProps {
  onClose: () => void;
  flashcards: Flashcard[];
  selectedDate?: Date;
}

export const StudyMode: React.FC<StudyModeProps> = ({ 
  onClose, 
  flashcards,
  selectedDate 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const updateFlashcard = useStore((state) => state.updateFlashcard);
  const updateStats = useStore((state) => state.updateStats);

  // Verifica se há flashcards disponíveis
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col items-center justify-center">
        <h2 className="text-white text-xl mb-4">Nenhum flashcard disponível para revisão.</h2>
        <button 
          onClick={onClose} 
          className="px-6 py-2 rounded-full bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  }, [currentIndex, flashcards.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const calculateNextReview = (difficulty: 'easy' | 'moderate' | 'hard' | 'error') => {
    const now = new Date();
    const baseDelay = {
      easy: 7,
      moderate: 3,
      hard: 1,
      error: 0
    };

    const days = baseDelay[difficulty];
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  };

  const handleResult = (difficulty: 'easy' | 'moderate' | 'hard' | 'error') => {
    if (!currentCard) return;

    const isCorrect = difficulty === 'easy' || difficulty === 'moderate';
    const nextReview = calculateNextReview(difficulty);
    
    updateFlashcard(currentCard.id, isCorrect, nextReview);
    updateStats(isCorrect);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    handleNext();
  };

  // Se não houver cartão atual, não renderiza nada
  if (!currentCard) return null;

  return (
    <div className="fixed inset-0 bg-[#121212] z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#282828]">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white hover:text-[#1DB954] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        {selectedDate && (
          <div className="flex items-center gap-2 text-white">
            <CalendarIcon className="w-5 h-5" />
            <span>
              {selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StudyProgress
              totalCards={flashcards.length}
              currentIndex={currentIndex}
              correctCount={correctCount}
              streak={streak}
            />
          </div>

          {/* Flashcard */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FlashCard
                  front={currentCard.front}
                  back={currentCard.back}
                  onResult={handleResult}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between p-4 bg-[#282828]">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
            ${currentIndex === 0
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-white hover:bg-[#383838]'
            }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white hover:bg-[#383838] transition-colors"
        >
          {currentIndex === flashcards.length - 1 ? 'Finalizar' : 'Pular'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
