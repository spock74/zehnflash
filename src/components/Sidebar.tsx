import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Layout, BarChart2, Settings, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AddDeckModal } from './deck/AddDeckModal';

export const Sidebar = () => {
  const decks = useStore((state) => state.decks);
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#121212] text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-8 h-8 text-[#1DB954]" />
          <h1 className="text-xl font-bold">FlashMaster</h1>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isActive ? 'bg-[#282828] text-[#1DB954]' : 'hover:bg-[#282828]'
              }`
            }
          >
            <Layout className="w-5 h-5" />
            <span>Painel</span>
          </NavLink>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-400">Seus Baralhos</h2>
              <button 
                onClick={() => setIsAddDeckModalOpen(true)}
                className="p-1 hover:bg-[#282828] rounded-full"
              >
                <Plus className="w-4 h-4 text-[#1DB954]" />
              </button>
            </div>
            
            <div className="space-y-1">
              {decks.map((deck) => (
                <NavLink
                  key={deck.id}
                  to={`/deck/${deck.id}`}
                  className={({ isActive }) =>
                    `block p-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#282828] text-[#1DB954]' : 'hover:bg-[#282828]'
                    }`
                  }
                >
                  {deck.name}
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isActive ? 'bg-[#282828] text-[#1DB954]' : 'hover:bg-[#282828]'
              }`
            }
          >
            <BarChart2 className="w-5 h-5" />
            <span>Estatísticas</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isActive ? 'bg-[#282828] text-[#1DB954]' : 'hover:bg-[#282828]'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </NavLink>
        </nav>
      </aside>

      <AddDeckModal 
        isOpen={isAddDeckModalOpen}
        onClose={() => setIsAddDeckModalOpen(false)}
      />
    </>
  );
};
