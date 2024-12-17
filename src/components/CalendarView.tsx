import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useStore } from '../store/useStore';

export const CalendarView: React.FC = () => {
  const flashcards = useStore((state) => state.flashcards);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  // Agrupa os flashcards por data
  const reviewsByDate = flashcards.reduce((acc, flashcard) => {
    if (flashcard.nextReview) {
      const dateStr = new Date(flashcard.nextReview).toDateString();
      acc[dateStr] = (acc[dateStr] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const count = reviewsByDate[date.toDateString()] || 0;
      if (count > 0) {
        return `review-date review-date-${count > 5 ? 'many' : 'few'}`;
      }
    }
    return '';
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const count = reviewsByDate[date.toDateString()] || 0;
      if (count > 0) {
        return (
          <div className="tile-content">
            <span className="review-count">{count}</span>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="calendar-wrapper p-4 bg-[#282828] rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Próximas Revisões</h2>
      <Calendar
        tileClassName={tileClassName}
        tileContent={tileContent}
        className="bg-[#282828] border-0 rounded-lg shadow-lg"
      />
      <div className="mt-4 text-white text-sm">
        <h3 className="font-bold mb-2">Legenda:</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#1DB954]"></div>
            <span>1-5 cards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#ff4444]"></div>
            <span>6+ cards</span>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .react-calendar {
          background-color: #282828;
          border: none;
          font-family: inherit;
          width: 100%;
        }
        .react-calendar__tile {
          color: white;
          padding: 1em 0.5em;
          position: relative;
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
          background: #666666;
        }
        .review-date {
          position: relative;
        }
        .review-date-few {
          background-color: #1DB954;
          color: white;
        }
        .review-date-many {
          background-color: #ff4444;
          color: white;
        }
        .tile-content {
          position: absolute;
          bottom: 4px;
          right: 4px;
          font-size: 0.7em;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .review-count {
          font-size: 10px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};
