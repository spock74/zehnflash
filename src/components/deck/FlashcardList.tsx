import React from 'react';
import { Flashcard } from '../../types';
import { FlashcardPreview } from './FlashcardPreview';

interface FlashcardListProps {
  flashcards: Flashcard[];
}

export const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map((flashcard) => (
        <FlashcardPreview key={flashcard.id} flashcard={flashcard} />
      ))}
    </div>
  );
};
