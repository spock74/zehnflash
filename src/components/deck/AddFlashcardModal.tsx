import React from 'react';
import { X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { FlashcardForm } from './FlashcardForm';

interface AddFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
}

export const AddFlashcardModal: React.FC<AddFlashcardModalProps> = ({
  isOpen,
  onClose,
  deckId,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#282828] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Adicionar Novo Flashcard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <FlashcardForm onClose={onClose} deckId={deckId} />
      </div>
    </Modal>
  );
};
