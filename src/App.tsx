import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DeckView } from './components/deck/DeckView';
import { CalendarView } from './components/CalendarView';
import { useStore } from './store/useStore';

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <Router>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="flex min-h-screen bg-[#121212]">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={
                <div className="space-y-8">
                  <div className="text-white">Painel em breve...</div>
                  <CalendarView />
                </div>
              } />
              <Route path="/deck/:deckId" element={<DeckView />} />
              <Route path="/stats" element={<div className="text-white">Estatísticas em breve...</div>} />
              <Route path="/settings" element={<div className="text-white">Configurações em breve...</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
