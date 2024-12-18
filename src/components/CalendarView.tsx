import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { StudyMode } from './study/StudyMode';
import { getCategoryColor } from '../utils/categoryColors';

export const CalendarView: React.FC = () => {
  const flashcards = useStore((state) => state.flashcards);
  const decks = useStore((state) => state.decks);
  const stats = useStore((state) => state.stats);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);
  
  // Agrupa os flashcards por data e categoria
  const reviewsByDateAndCategory = flashcards.reduce((acc, flashcard) => {
    if (flashcard.nextReview) {
      const dateStr = new Date(flashcard.nextReview).toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = {};
      }
      
      const deck = decks.find(d => d.id === flashcard.deckId);
      if (deck) {
        if (!acc[dateStr][deck.category]) {
          acc[dateStr][deck.category] = 0;
        }
        acc[dateStr][deck.category]++;
      }
    }
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Filtra flashcards para o dia selecionado
  const getFlashcardsForDate = (date: Date) => {
    return flashcards.filter(flashcard => 
      flashcard.nextReview && 
      new Date(flashcard.nextReview).toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    const cardsForDate = getFlashcardsForDate(date);
    if (cardsForDate.length > 0) {
      setSelectedDate(date);
      setIsStudyMode(true);
    }
  };

  if (isStudyMode && selectedDate) {
    const cardsForDate = getFlashcardsForDate(selectedDate);
    return (
      <StudyMode
        onClose={() => setIsStudyMode(false)}
        flashcards={cardsForDate}
        selectedDate={selectedDate}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <CalendarIcon className="w-6 h-6 text-[#1DB954]" />
            <h2 className="text-xl font-bold text-white">Calendário de Revisões</h2>
          </div>
          
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileClassName={({ date, view }) => {
              if (view === 'month') {
                const dateStr = date.toDateString();
                const categories = reviewsByDateAndCategory[dateStr];
                return categories ? 'has-reviews cursor-pointer' : '';
              }
              return '';
            }}
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dateStr = date.toDateString();
                const categories = reviewsByDateAndCategory[dateStr];
                
                if (categories) {
                  return (
                    <div className="category-indicators">
                      {Object.entries(categories).map(([category, count]) => (
                        <div
                          key={category}
                          className="category-dot"
                          style={{
                            backgroundColor: getCategoryColor(category),
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            margin: '1px',
                            display: 'inline-block'
                          }}
                          title={`${category}: ${count} cartões`}
                        />
                      ))}
                    </div>
                  );
                }
              }
              return null;
            }}
            className="bg-[#282828] border-0 rounded-lg shadow-lg w-full"
          />
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#282828] rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-lg font-semibold text-white">Resumo do Dia</h3>
          </div>
          
          {selectedDate ? (
            <div className="space-y-3">
              <p className="text-gray-300">
                {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center gap-2 text-white">
                <span className="text-2xl font-bold">
                  {reviewsByDateAndCategory[selectedDate.toDateString()] 
                    ? Object.values(reviewsByDateAndCategory[selectedDate.toDateString()])
                        .reduce((a, b) => a + b, 0)
                    : 0}
                </span>
                <span className="text-gray-400">cartões para revisar</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Selecione uma data para ver os detalhes</p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#282828] rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-lg font-semibold text-white">Estatísticas Gerais</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Total Revisado</p>
              <p className="text-2xl font-bold text-white">{stats.cardsReviewed}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Taxa de Acerto</p>
              <p className="text-2xl font-bold text-[#1DB954]">
                {stats.cardsReviewed > 0 
                  ? `${Math.round((stats.correctAnswers / stats.cardsReviewed) * 100)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>
        {`
          .react-calendar {
            background-color: transparent;
            border: none;
            font-family: inherit;
            width: 100%;
          }
          .react-calendar__tile {
            color: white;
            padding: 1em 0.5em;
            position: relative;
            aspect-ratio: 1;
          }
          .react-calendar__month-view__days__day {
            color: #ffffff;
          }
          .react-calendar__month-view__days__day--weekend {
            color: #ff4444;
          }
          .react-calendar__month-view__days__day--neighboringMonth {
            color: #666666;
          }
          .react-calendar__navigation button {
            color: white;
            min-width: 44px;
            background: none;
            font-size: 16px;
            margin-top: 8px;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #1DB954;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #1DB954;
            color: white;
          }
          .react-calendar__tile--now {
            background: #383838;
          }
          .react-calendar__tile--now:enabled:hover,
          .react-calendar__tile--now:enabled:focus {
            background: #1DB954;
          }
          .has-reviews {
            background-color: #1e1e1e;
          }
          .category-indicators {
            position: absolute;
            bottom: 4px;
            right: 4px;
            display: flex;
            gap: 2px;
            flex-wrap: wrap;
            max-width: 24px;
            justify-content: flex-end;
          }
        `}
      </style>
    </div>
  );
};
