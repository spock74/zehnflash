import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, FileText, Code } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { generateId } from '../../utils/generateId';
import { pythonDictToJson, validateFlashcardData } from '../../utils/pythonToJson';

export const BatchImport: React.FC = () => {
  const [pythonInput, setPythonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { addDeck, addFlashcard, settings, addDeckTopic, addCardTag } = useStore();

  const handleImport = () => {
    try {
      // Converter entrada Python para JSON
      const data = pythonDictToJson(pythonInput);
      
      // Validar dados
      validateFlashcardData(data);

      // Data atual para revisão inicial
      const now = new Date();

      // Agrupar cartões por deck
      const deckMap = new Map();
      data.forEach(item => {
        const deckKey = `${item.deck.name}-${item.deck.category}`;
        if (!deckMap.has(deckKey)) {
          deckMap.set(deckKey, {
            deck: item.deck,
            cards: []
          });
        }
        deckMap.get(deckKey).cards.push(item);
      });

      // Processar cada deck e seus cartões
      deckMap.forEach(({ deck, cards }) => {
        // Criar novo deck
        const newDeck = {
          id: generateId(),
          name: deck.name,
          category: deck.category,
          userId: 'admin',
          createdAt: now,
          updatedAt: now
        };

        // Adicionar novo tópico se não existir
        if (!settings.deckTopics.includes(deck.category)) {
          addDeckTopic(deck.category);
        }

        // Adicionar deck
        addDeck(newDeck);

        // Processar cartões do deck
        cards.forEach(card => {
          // Adicionar novas tags se necessário
          card.tags?.forEach(tag => {
            if (!settings.cardTags.includes(tag)) {
              addCardTag(tag);
            }
          });

          // Criar novo flashcard com data de revisão inicial
          const newCard = {
            id: generateId(),
            front: card.front,
            back: card.back,
            deckId: newDeck.id,
            box: 1,
            nextReview: now, // Define a data de revisão como agora
            streak: 0,
            lastReviewed: null,
            tags: card.tags || [],
            difficulty: card.difficulty,
            metadata: {
              ...card.metadata,
              importedAt: now.toISOString() // Adiciona data de importação
            }
          };

          addFlashcard(newCard);
        });
      });

      setSuccess(true);
      setPythonInput('');
      setTimeout(() => setSuccess(false), 3000);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar dados');
      setSuccess(false);
    }
  };

  return (
    <div className="bg-[#282828] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-5 h-5 text-[#1DB954]" />
        <h3 className="text-white font-medium">Importação de Lista Python</h3>
      </div>

      <div className="space-y-6">
        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-gray-400 text-sm">Cole sua lista de dicionários Python:</label>
          <textarea
            value={pythonInput}
            onChange={(e) => setPythonInput(e.target.value)}
            className="w-full h-64 bg-[#1e1e1e] text-white rounded-lg p-4 font-mono text-sm
              border border-[#484848] focus:border-[#1DB954] focus:ring-1 
              focus:ring-[#1DB954] outline-none"
            placeholder={`[
  {
    'front': 'Qual é a capital da França?',
    'back': 'Paris',
    'deck': {
        'name': 'Geografia',
        'category': 'Estudos Sociais'
    },
    'tags': ['capitais', 'europa'],
    'difficulty': 'Fácil'
  }
]`}
          />
        </div>

        <button
          onClick={handleImport}
          disabled={!pythonInput.trim()}
          className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2
            ${pythonInput.trim() 
              ? 'bg-[#1DB954] hover:bg-[#1ed760] text-white' 
              : 'bg-[#383838] text-gray-400 cursor-not-allowed'
            } transition-colors`}
        >
          <Upload className="w-4 h-4" />
          Importar Cartões
        </button>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg"
          >
            <CheckCircle className="w-5 h-5" />
            Importação concluída com sucesso! Os cartões aparecerão no calendário para hoje.
          </motion.div>
        )}

        {/* Example Format */}
        <div className="mt-6">
          <h4 className="text-white font-medium mb-2">Exemplo de Formato Python:</h4>
          <pre className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto text-sm text-gray-400">
{`[
    {
        'front': 'O que é uma closure em JavaScript?',
        'back': 'Uma função que mantém acesso ao escopo pai',
        'deck': {
            'name': 'JavaScript Básico',
            'category': 'Programação'
        },
        'tags': ['funções', 'conceitos'],
        'difficulty': 'Médio',
        'metadata': {
            'bloomLevel': 'Entender',
            'source': 'MDN',
            'notes': 'Conceito fundamental'
        }
    },
    {
        'front': 'Como declarar uma variável em Python?',
        'back': 'nome_variavel = valor',
        'deck': {
            'name': 'Python Básico',
            'category': 'Programação'
        },
        'tags': ['variáveis', 'sintaxe'],
        'difficulty': 'Fácil'
    }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
};
