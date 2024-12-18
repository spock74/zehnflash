import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Play } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { FlashcardList } from './FlashcardList';
import { AddFlashcardModal } from './AddFlashcardModal';
import { StudyMode } from '../study/StudyMode';

export const DeckView = () => {
  const { deckId } = useParams();
  const deck = useStore((state) => 
    state.decks.find((d) => d.id === deckId)
  );
  const flashcards = useStore((state) => 
    state.flashcards.filter((f) => f.deckId === deckId)
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);

  if (!deck) {
    return (
      <div className="text-white text-center">
        Baralho não encontrado
      </div>
    );
  }

  // Filtra apenas os cartões que precisam ser revisados hoje
  const cardsToReview = flashcards.filter(card => {
    if (!card.nextReview) return true;
    const now = new Date();
    return new Date(card.nextReview) <= now;
  });

  return (
    <>
      <div className="text-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{`${deck.category}: ${deck.name}`}</h1>
            <p className="text-gray-400 mt-1">{flashcards.length} cartões no total</p>
          </div>
          <div className="flex gap-3">
            {flashcards.length > 0 && (
              <button
                onClick={() => setIsStudyMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#282828] rounded-full hover:bg-[#383838] transition-colors"
              >
                <Play className="w-5 h-5" />
                Estudar ({cardsToReview.length})
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] rounded-full hover:bg-[#1ed760] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adicionar Cartão
            </button>
          </div>
        </div>

        {flashcards.length === 0 ? (
          <div className="text-center py-12 bg-[#282828] rounded-lg">
            <p className="text-gray-400">Nenhum flashcard ainda. Crie o seu primeiro!</p>
          </div>
        ) : (
          <FlashcardList flashcards={flashcards} />
        )}
      </div>

      <AddFlashcardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        deckId={deck.id}
      />

      {isStudyMode && (
        <StudyMode
          onClose={() => setIsStudyMode(false)}
          flashcards={cardsToReview}
          selectedDate={new Date()}
        />
      )}
    </>
  );
};
