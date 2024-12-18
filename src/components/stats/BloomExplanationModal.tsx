import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BloomExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloomExplanationModal: React.FC<BloomExplanationModalProps> = ({ isOpen, onClose }) => {
  const examples = [
    {
      title: "Aprendizado Equilibrado",
      description: "Distribuição uniforme indica domínio consistente em todos os níveis cognitivos.",
      imagePath: "data:image/svg+xml;base64,..." // Substituir com SVG real
    },
    {
      title: "Foco em Memorização",
      description: "Concentração nos níveis básicos sugere necessidade de desenvolver habilidades de ordem superior.",
      imagePath: "data:image/svg+xml;base64,..." // Substituir com SVG real
    },
    {
      title: "Pensamento Crítico Avançado",
      description: "Forte desempenho nos níveis superiores indica excelente capacidade de análise e criação.",
      imagePath: "data:image/svg+xml;base64,..." // Substituir com SVG real
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl 
              bg-[#282828] rounded-xl p-8 z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Entendendo o Gráfico de Bloom</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#383838] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Introdução */}
            <div className="mb-8 text-gray-300">
              <p className="mb-4">
                O gráfico radar da Taxonomia de Bloom visualiza seu progresso em seis níveis 
                diferentes de aprendizado, desde habilidades básicas até as mais complexas.
              </p>
              <div className="bg-[#1e1e1e] p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Como ler o gráfico:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Cada eixo representa um nível cognitivo da Taxonomia de Bloom</li>
                  <li>• A distância do centro indica o desempenho (0-5)</li>
                  <li>• Círculos concêntricos mostram níveis de referência</li>
                  <li>• A área preenchida representa seu perfil de aprendizado</li>
                </ul>
              </div>
            </div>

            {/* Níveis de Bloom */}
            <div className="mb-8">
              <h3 className="text-white font-medium mb-4">Os Seis Níveis Cognitivos</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    level: "Lembrar",
                    description: "Recordar fatos e conceitos básicos",
                    examples: "Definir, listar, reconhecer"
                  },
                  {
                    level: "Entender",
                    description: "Explicar ideias ou conceitos",
                    examples: "Classificar, descrever, explicar"
                  },
                  {
                    level: "Aplicar",
                    description: "Usar informações em novas situações",
                    examples: "Executar, implementar, resolver"
                  },
                  {
                    level: "Analisar",
                    description: "Estabelecer conexões entre ideias",
                    examples: "Comparar, organizar, questionar"
                  },
                  {
                    level: "Avaliar",
                    description: "Justificar decisões ou posições",
                    examples: "Argumentar, defender, julgar"
                  },
                  {
                    level: "Criar",
                    description: "Produzir trabalho original",
                    examples: "Projetar, desenvolver, formular"
                  }
                ].map((item) => (
                  <div key={item.level} className="bg-[#1e1e1e] p-4 rounded-lg">
                    <h4 className="text-[#1DB954] font-medium mb-1">{item.level}</h4>
                    <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                    <p className="text-gray-400 text-xs">Ex: {item.examples}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exemplos de Padrões */}
            <div>
              <h3 className="text-white font-medium mb-4">Padrões Comuns e Interpretações</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {examples.map((example) => (
                  <div key={example.title} className="bg-[#1e1e1e] p-4 rounded-lg">
                    <div className="aspect-square mb-4 bg-[#282828] rounded-lg p-4">
                      {/* Aqui entraria o SVG de exemplo */}
                    </div>
                    <h4 className="text-white font-medium mb-2">{example.title}</h4>
                    <p className="text-gray-400 text-sm">{example.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dicas de Uso */}
            <div className="mt-8 bg-[#1e1e1e] p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Dicas de Uso</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Busque um equilíbrio entre todos os níveis</li>
                <li>• Identifique áreas que precisam de mais atenção</li>
                <li>• Use os insights para direcionar seus estudos</li>
                <li>• Monitore seu progresso ao longo do tempo</li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
