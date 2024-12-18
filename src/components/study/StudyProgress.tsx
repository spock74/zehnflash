import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap } from 'lucide-react';

interface StudyProgressProps {
  totalCards: number;
  currentIndex: number;
  correctCount: number;
  streak: number;
}

export const StudyProgress: React.FC<StudyProgressProps> = ({
  totalCards,
  currentIndex,
  correctCount,
  streak
}) => {
  const progress = (currentIndex / totalCards) * 100;
  const accuracy = currentIndex > 0 ? (correctCount / currentIndex) * 100 : 0;

  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#1DB954]" />
          <span className="text-white font-medium">Progresso</span>
        </div>
        <span className="text-gray-400">
          {currentIndex} de {totalCards} cartões
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="h-2 bg-[#383838] rounded-full mb-4">
        <motion.div
          className="h-full bg-[#1DB954] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Taxa de Acerto */}
        <div className="bg-[#1e1e1e] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm">Taxa de Acerto</span>
          </div>
          <span className="text-xl font-bold text-white">
            {accuracy.toFixed(1)}%
          </span>
        </div>

        {/* Sequência */}
        <div className="bg-[#1e1e1e] rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-gray-400 text-sm">Sequência</span>
          </div>
          <span className="text-xl font-bold text-white">
            {streak}
          </span>
        </div>
      </div>
    </div>
  );
};
