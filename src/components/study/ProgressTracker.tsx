import React from 'react';
import { useStore } from '../../store/useStore';

export const ProgressTracker: React.FC = () => {
  const { cardsReviewed, correctAnswers } = useStore((state) => state.stats); // Acesso correto ao estado
  const totalCards = cardsReviewed;

  return (
    <div className="text-white p-4 bg-[#282828] rounded-lg">
      <h2 className="text-lg font-bold">Progresso</h2>
      <p>Total de Cartões Revisados: {totalCards}</p>
      <p>Respostas Corretas: {correctAnswers}</p>
      <p>
        Taxa de Acertos: {totalCards > 0 ? ((correctAnswers / totalCards) * 100).toFixed(2) : 0}%
      </p>
    </div>
  );
};
