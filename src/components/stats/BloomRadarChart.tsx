import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  Wrench, 
  Search, 
  Scale, 
  Sparkles,
  HelpCircle 
} from 'lucide-react';
import { BloomExplanationModal } from './BloomExplanationModal';

interface BloomMetric {
  level: string;
  score: number;
  total: number;
  masteredCards?: number;
  averageStreak?: number;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface BloomRadarChartProps {
  flashcards: Array<{
    metadata?: {
      bloomLevel?: string;
    };
    streak: number;
  }>;
}

const BLOOM_LEVELS = [
  { 
    level: 'Lembrar', 
    score: 0, 
    total: 0, 
    icon: Brain,
    color: '#FF6B6B',
    description: 'Recordar fatos e conceitos básicos. Envolve reconhecimento e memória de informações.'
  },
  { 
    level: 'Entender', 
    score: 0, 
    total: 0, 
    icon: Lightbulb,
    color: '#4ECDC4',
    description: 'Explicar ideias ou conceitos. Demonstrar compreensão através de interpretação e explicação.'
  },
  { 
    level: 'Aplicar', 
    score: 0, 
    total: 0, 
    icon: Wrench,
    color: '#45B7D1',
    description: 'Usar informações em novas situações. Aplicar conhecimento em contextos práticos.'
  },
  { 
    level: 'Analisar', 
    score: 0, 
    total: 0, 
    icon: Search,
    color: '#96CEB4',
    description: 'Estabelecer conexões entre ideias. Dividir informações em partes para explorar relações.'
  },
  { 
    level: 'Avaliar', 
    score: 0, 
    total: 0, 
    icon: Scale,
    color: '#D4A5A5',
    description: 'Justificar uma decisão ou posição. Fazer julgamentos baseados em critérios.'
  },
  { 
    level: 'Criar', 
    score: 0, 
    total: 0, 
    icon: Sparkles,
    color: '#9B5DE5',
    description: 'Produzir trabalho original ou novo. Combinar elementos para criar algo único.'
  }
] as const;

export const BloomRadarChart: React.FC<BloomRadarChartProps> = ({ flashcards }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcula métricas para cada nível
  const metrics = BLOOM_LEVELS.map(level => {
    const cardsInLevel = flashcards.filter(
      card => card.metadata?.bloomLevel === level.level
    );
    const total = cardsInLevel.length;
    
    if (total === 0) return { ...level, score: 0, total: 0, masteredCards: 0, averageStreak: 0 };

    const averageStreak = cardsInLevel.reduce((acc, card) => acc + (card.streak || 0), 0) / total;
    const masteredCards = cardsInLevel.filter(card => (card.streak || 0) >= 3).length;
    const masteryRate = masteredCards / total;

    // Pontuação combinada (0-5)
    const score = (
      (averageStreak * 0.4) +           // 40% baseado na média das sequências
      (Math.min(total / 5, 1) * 0.3) +  // 30% baseado no número de cartões (max 5)
      (masteryRate * 0.3)               // 30% baseado na taxa de domínio
    ) * 5;

    return {
      ...level,
      score,
      total,
      masteredCards,
      averageStreak
    };
  });

  // Calcula pontos do polígono
  const getPolygonPoints = () => {
    const center = { x: 150, y: 150 };
    const radius = 120;
    const angleStep = (2 * Math.PI) / metrics.length;

    return metrics.map((metric, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = Math.pow(metric.score / 5, 0.7);
      
      return {
        x: center.x + radius * normalizedValue * Math.cos(angle),
        y: center.y + radius * normalizedValue * Math.sin(angle),
        label: {
          x: center.x + (radius + 30) * Math.cos(angle),
          y: center.y + (radius + 30) * Math.sin(angle)
        },
        value: metric.score
      };
    });
  };

  const points = getPolygonPoints();
  const polygonPath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  // Linhas de referência
  const referenceLines = [0.2, 0.4, 0.6, 0.8, 1].map(scale => ({
    radius: 120 * scale,
    label: (scale * 5).toFixed(1)
  }));

  return (
    <div className="bg-[#282828] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-white font-medium">Taxonomia de Bloom</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1 hover:bg-[#383838] rounded-full transition-colors group relative"
        >
          <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#1DB954]" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 
            text-xs bg-[#1e1e1e] text-gray-300 rounded opacity-0 group-hover:opacity-100 
            transition-opacity whitespace-nowrap">
            Entender o gráfico
          </span>
        </button>
      </div>
      
      <div className="relative">
        <svg width="400" height="400" className="mx-auto">
          <g transform="translate(50, 50)">
            {/* Círculos de referência */}
            {referenceLines.map((line, i) => (
              <g key={i}>
                <motion.circle
                  cx="150"
                  cy="150"
                  r={line.radius}
                  fill="none"
                  stroke="#383838"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
                <motion.text
                  x="155"
                  y={150 - line.radius}
                  fill="#666"
                  fontSize="10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  {line.label}
                </motion.text>
              </g>
            ))}

            {/* Linhas de eixo */}
            {metrics.map((_, i) => {
              const angle = (i * 2 * Math.PI) / metrics.length - Math.PI / 2;
              return (
                <motion.line
                  key={i}
                  x1="150"
                  y1="150"
                  x2={150 + 120 * Math.cos(angle)}
                  y2={150 + 120 * Math.sin(angle)}
                  stroke="#383838"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              );
            })}

            {/* Labels dos níveis */}
            {points.map((point, i) => (
              <g key={`label-${i}`}>
                <motion.text
                  x={point.label.x}
                  y={point.label.y}
                  fill="#9CA3AF"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {metrics[i].level}
                </motion.text>
              </g>
            ))}

            {/* Área do radar */}
            <motion.path
              d={polygonPath}
              fill="rgba(29, 185, 84, 0.2)"
              stroke="#1DB954"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Pontos de dados */}
            {points.map((point, i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill={metrics[i].color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                />
                <motion.text
                  x={point.x}
                  y={point.y - 10}
                  fill="#fff"
                  fontSize="10"
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                >
                  {point.value.toFixed(1)}
                </motion.text>
              </motion.g>
            ))}
          </g>
        </svg>

        {/* Legendas */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.level}
                className="flex items-center gap-2 group relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <Icon 
                    className="w-4 h-4"
                    style={{ color: metric.color }}
                  />
                </div>
                <div>
                  <p className="text-white text-sm">{metric.level}</p>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">
                      Score: {metric.score.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400">
                      ({metric.total} cartões)
                    </div>
                  </div>
                </div>
                {/* Tooltip */}
                <div className="absolute left-0 bottom-full mb-2 p-3 bg-[#1e1e1e] rounded-lg 
                  text-xs text-gray-300 w-56 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-200 pointer-events-none z-10">
                  <p className="mb-1">{metric.description}</p>
                  <div className="mt-2 space-y-1">
                    <p>Total de cartões: {metric.total}</p>
                    <p>Cartões dominados: {metric.masteredCards}</p>
                    <p>Média de sequência: {metric.averageStreak?.toFixed(1) || 0}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BloomExplanationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
