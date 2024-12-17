import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard } from '../../types';

interface FlashcardPreviewProps {
  flashcard: Flashcard;
}

export const FlashcardPreview: React.FC<FlashcardPreviewProps> = ({ flashcard }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-[#282828] rounded-lg p-4 h-48 cursor-pointer relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="h-full flex items-center justify-center">
        <p className="text-lg text-center">
          {isHovered ? flashcard.back : flashcard.front}
        </p>
      </div>
      <div className="absolute bottom-2 right-2">
        <span className="text-xs text-gray-400">
          Caixa {flashcard.box}
        </span>
      </div>
    </motion.div>
  );
};
