import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Tag, Folder, Plus, X, Upload, Shield, LogOut } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { BatchImport } from '../admin/BatchImport';

export const SettingsView = () => {
  const { settings, addDeckTopic, removeDeckTopic, addCardTag, removeCardTag, user, loginAsAdmin, logoutUser } = useStore();
  const [newTopic, setNewTopic] = useState('');
  const [newTag, setNewTag] = useState('');
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode === 'admin123') { // Simplified for demonstration
      loginAsAdmin();
      setShowAdminPrompt(false);
      setAdminCode('');
      setError('');
    } else {
      setError('Código inválido');
    }
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopic.trim()) {
      addDeckTopic(newTopic.trim());
      setNewTopic('');
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addCardTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-[#1DB954]" />
          <h2 className="text-2xl font-bold text-white">Configurações</h2>
        </div>
        
        {/* Admin Access Controls */}
        <div className="flex items-center gap-4">
          {user?.role === 'admin' ? (
            <button
              onClick={logoutUser}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg 
                hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair do Modo Admin
            </button>
          ) : (
            <button
              onClick={() => setShowAdminPrompt(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#383838] text-white rounded-lg 
                hover:bg-[#484848] transition-colors"
            >
              <Shield className="w-4 h-4" />
              Acesso Admin
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#282828] rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-white text-xl font-bold mb-4">Acesso Administrativo</h3>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Código de Acesso</label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#383838] text-white rounded-lg 
                    border border-[#484848] focus:border-[#1DB954] focus:ring-1 
                    focus:ring-[#1DB954] outline-none"
                  placeholder="Digite o código de acesso"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPrompt(false);
                    setError('');
                    setAdminCode('');
                  }}
                  className="px-4 py-2 text-white hover:bg-[#383838] rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] 
                    transition-colors"
                >
                  Acessar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BatchImport />
        </motion.div>
      )}

      {/* Regular Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tópicos dos Decks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Folder className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Tópicos dos Baralhos</h3>
          </div>

          <form onSubmit={handleAddTopic} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Adicionar novo tópico..."
                className="flex-1 px-3 py-2 bg-[#383838] text-white rounded-lg 
                  border border-[#484848] focus:border-[#1DB954] focus:ring-1 
                  focus:ring-[#1DB954] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] 
                  transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            {settings.deckTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-2 px-3 py-1 bg-[#383838] rounded-full"
              >
                <span className="text-white">{topic}</span>
                <button
                  onClick={() => removeDeckTopic(topic)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tags dos Cartões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Tag className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Tags dos Cartões</h3>
          </div>

          <form onSubmit={handleAddTag} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar nova tag..."
                className="flex-1 px-3 py-2 bg-[#383838] text-white rounded-lg 
                  border border-[#484848] focus:border-[#1DB954] focus:ring-1 
                  focus:ring-[#1DB954] outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] 
                  transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            {settings.cardTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 py-1 bg-[#383838] rounded-full"
              >
                <span className="text-white">{tag}</span>
                <button
                  onClick={() => removeCardTag(tag)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
