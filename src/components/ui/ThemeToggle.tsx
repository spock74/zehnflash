import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useStore();

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative p-2 rounded-lg transition-colors ${
        isDarkMode ? 'bg-[#383838]' : 'bg-gray-200'
      }`}
      aria-label="Alternar tema"
    >
      <div className="w-14 h-7 relative">
        <motion.div
          initial={false}
          animate={{
            x: isDarkMode ? '100%' : '0%',
            rotate: isDarkMode ? 360 : 0
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute left-0 top-0 w-7 h-7 rounded-full flex items-center justify-center"
        >
          {isDarkMode ? (
            <Moon className="w-5 h-5 text-[#1DB954]" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </motion.div>
      </div>
    </button>
  );
};
