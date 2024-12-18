import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Layout, BarChart2, Settings, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AddDeckModal } from './deck/AddDeckModal';
import { getCategoryColor } from '../utils/categoryColors';

export const Sidebar = () => {
  const decks = useStore((state) => state.decks);
  const flashcards = useStore((state) => state.flashcards);
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Agrupa decks por categoria
  const decksByCategory = decks.reduce((acc, deck) => {
    if (!acc[deck.category]) {
      acc[deck.category] = [];
    }
    acc[deck.category].push(deck);
    return acc;
  }, {} as Record<string, typeof decks>);

  // Calcula o número de cartões por categoria
  const getCardCountByCategory = (category: string) => {
    return flashcards.filter(card => 
      decks.find(deck => deck.id === card.deckId)?.category === category
    ).length;
  };

  // Calcula o número de cartões por deck
  const getCardCount = (deckId: string) => {
    return flashcards.filter(card => card.deckId === deckId).length;
  };

  // Toggle expansão da categoria
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#121212] text-white p-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#1DB954]" />
            <h1 className="text-xl font-bold">FlashMaster</h1>
          </div>
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
              <h2 className="text-sm font-semibold text-gray-400">Categorias</h2>
              <button 
                onClick={() => setIsAddDeckModalOpen(true)}
                className="p-1 hover:bg-[#282828] rounded-full"
              >
                <Plus className="w-4 h-4 text-[#1DB954]" />
              </button>
            </div>
            
            <div className="space-y-1">
              {Object.entries(decksByCategory).map(([category, categoryDecks]) => (
                <div key={category} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-2 hover:bg-[#282828] rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {expandedCategories.includes(category) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                        <span className="text-sm font-medium">{category}</span>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#383838] text-[#1DB954]">
                      {getCardCountByCategory(category)}
                    </span>
                  </button>

                  {expandedCategories.includes(category) && (
                    <div className="ml-4 space-y-1">
                      {categoryDecks.map((deck) => (
                        <NavLink
                          key={deck.id}
                          to={`/deck/${deck.id}`}
                          className={({ isActive }) =>
                            `flex items-center justify-between p-2 rounded-lg transition-colors ${
                              isActive ? 'bg-[#282828] text-[#1DB954]' : 'hover:bg-[#282828]'
                            }`
                          }
                        >
                          <span className="truncate text-sm">
                            {deck.name}
                          </span>
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#383838] text-gray-400">
                            {getCardCount(deck.id)}
                          </span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
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
