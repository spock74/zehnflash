import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { generateId } from '../../utils/generateId';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';

interface FlashcardFormProps {
  onClose: () => void;
  deckId: string;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({ onClose, deckId }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const addFlashcard = useStore((state) => state.addFlashcard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) return;

    const newFlashcard = {
      id: generateId(),
      front: front.trim(),
      back: back.trim(),
      deckId,
      box: 1,
      lastReviewed: new Date(),
    };

    addFlashcard(newFlashcard);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <TextArea
          label="Frente"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Digite a pergunta ou o prompt..."
          required
        />
      </div>

      <div>
        <TextArea
          label="Verso"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Digite a resposta..."
          required
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-full text-white hover:bg-[#383838] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors"
        >
          Criar Cartão
        </button>
      </div>
    </form>
  );
};
