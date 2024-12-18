import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DeckView } from './components/deck/DeckView';
import { CalendarView } from './components/CalendarView';
import StatisticsView from './components/stats/StatisticsView';
import { SettingsView } from './components/settings/SettingsView';
import { useStore } from './store/useStore';

// Change to named export
export function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <Router>
      <div className={isDarkMode ? 'dark' : 'light'}>
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-100'}`}>
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={
                <div className="space-y-8">
                  <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Painel em breve...
                  </div>
                  <CalendarView />
                </div>
              } />
              <Route path="/deck/:deckId" element={<DeckView />} />
              <Route path="/stats" element={<StatisticsView />} />
              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
