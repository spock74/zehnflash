import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { generateId } from '../../utils/generateId';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface DeckFormProps {
  onClose: () => void;
}

const CATEGORIES = [
  'Idiomas',
  'Matemática',
  'Ciência',
  'História',
  'Programação',
  'Outro',
];

export const DeckForm: React.FC<DeckFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const addDeck = useStore((state) => state.addDeck);
  const user = useStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const newDeck = {
      id: generateId(),
      name: name.trim(),
      category,
      userId: user?.id || 'anônimo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addDeck(newDeck);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Nome do Baralho"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite o nome do baralho..."
          required
        />
      </div>

      <div>
        <Select
          label="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORIES}
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
          Criar Baralho
        </button>
      </div>
    </form>
  );
};
