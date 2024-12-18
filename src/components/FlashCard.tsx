import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Activity, AlertCircle, XCircle } from 'lucide-react';

interface FlashCardProps {
  front: string;
  back: string;
  onResult: (difficulty: 'easy' | 'moderate' | 'hard' | 'error') => void;
}

export const FlashCard = ({ front, back, onResult }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const difficultyButtons = [
    {
      label: 'Fácil',
      value: 'easy' as const,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      icon: ThumbsUp,
      description: 'Intervalo aumenta muito'
    },
    {
      label: 'Moderado',
      value: 'moderate' as const,
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: Activity,
      description: 'Intervalo aumenta pouco'
    },
    {
      label: 'Difícil',
      value: 'hard' as const,
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: AlertCircle,
      description: 'Intervalo curto'
    },
    {
      label: 'Erro',
      value: 'error' as const,
      color: 'bg-red-500 hover:bg-red-600',
      icon: XCircle,
      description: 'Revisão imediata'
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto perspective space-y-6">
      <motion.div
        className="relative w-full h-96 cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`absolute w-full h-full rounded-xl p-6 backface-hidden
            ${isFlipped ? 'hidden' : 'bg-[#282828]'}`}
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-white text-center">{front}</p>
          </div>
        </div>

        <div
          className={`absolute w-full h-full rounded-xl p-6 backface-hidden
            ${!isFlipped ? 'hidden' : 'bg-[#1DB954]'}`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-white text-center">{back}</p>
          </div>
        </div>
      </motion.div>

      {isFlipped && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-4 gap-3">
            {difficultyButtons.map((button) => (
              <button
                key={button.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onResult(button.value);
                  setIsFlipped(false);
                }}
                className={`${button.color} rounded-xl p-4 text-white transition-all transform hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex flex-col items-center gap-2">
                  <button.icon className="w-6 h-6" />
                  <span className="font-medium">{button.label}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            {difficultyButtons.map((button) => (
              <div key={button.value} className="text-gray-400 text-sm">
                {button.description}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
