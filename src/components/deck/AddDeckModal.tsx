import React from 'react';
import { X } from 'lucide-react';
import { DeckForm } from './DeckForm';
import { Modal } from '../ui/Modal';

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDeckModal: React.FC<AddDeckModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#282828] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Criar Novo Baralho</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <DeckForm onClose={onClose} />
      </div>
    </Modal>
  );
};
