import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlashCardProps {
  front: string;
  back: string;
  onResult: (correct: boolean) => void;
}

export const FlashCard = ({ front, back, onResult }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-xl mx-auto perspective">
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
          <div className="flex flex-col items-center justify-between h-full">
            <p className="text-xl text-white text-center flex-1">
              {back}
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResult(false);
                }}
                className="px-6 py-2 rounded-full bg-red-500 text-white"
              >
                Incorreto
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResult(true);
                }}
                className="px-6 py-2 rounded-full bg-green-500 text-white"
              >
                Correto
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
