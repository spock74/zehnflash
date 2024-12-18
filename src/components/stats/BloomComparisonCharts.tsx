import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  Wrench, 
  Search, 
  Scale, 
  Sparkles,
  HelpCircle,
  SplitSquareHorizontal
} from 'lucide-react';

interface BloomComparisonProps {
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
    icon: Brain,
    color: '#FF6B6B',
    description: 'Recordar fatos e conceitos básicos'
  },
  { 
    level: 'Entender', 
    icon: Lightbulb,
    color: '#4ECDC4',
    description: 'Explicar ideias ou conceitos'
  },
  { 
    level: 'Aplicar', 
    icon: Wrench,
    color: '#45B7D1',
    description: 'Usar informações em novas situações'
  },
  { 
    level: 'Analisar', 
    icon: Search,
    color: '#96CEB4',
    description: 'Estabelecer conexões entre ideias'
  },
  { 
    level: 'Avaliar', 
    icon: Scale,
    color: '#D4A5A5',
    description: 'Justificar decisões ou posições'
  },
  { 
    level: 'Criar', 
    icon: Sparkles,
    color: '#9B5DE5',
    description: 'Produzir trabalho original'
  }
] as const;

const BloomComparisonCharts: React.FC<BloomComparisonProps> = ({ flashcards }) => {
  // Calculate metrics for normalized chart (left)
  const normalizedMetrics = BLOOM_LEVELS.map(level => {
    const cardsInLevel = flashcards.filter(
      card => card.metadata?.bloomLevel === level.level
    );
    const total = cardsInLevel.length;
    
    if (total === 0) return { ...level, score: 0, total: 0 };

    const averageStreak = cardsInLevel.reduce((acc, card) => acc + (card.streak || 0), 0) / total;
    const masteredCards = cardsInLevel.filter(card => (card.streak || 0) >= 3).length;
    const masteryRate = masteredCards / total;

    const score = (
      (averageStreak * 0.4) +
      (Math.min(total / 5, 1) * 0.3) +
      (masteryRate * 0.3)
    ) * 5;

    return { ...level, score, total };
  });

  // Calculate metrics for raw data chart (right)
  const rawMetrics = BLOOM_LEVELS.map(level => {
    const total = flashcards.filter(
      card => card.metadata?.bloomLevel === level.level
    ).length;
    return { ...level, total };
  });

  // Find maximum value for raw data scaling
  const maxRawValue = Math.max(...rawMetrics.map(m => m.total));
  const rawAxisScale = Math.ceil(maxRawValue / 5) * 5; // Round up to nearest 5

  const renderChart = (metrics: typeof normalizedMetrics, isRaw: boolean) => {
    const center = { x: 150, y: 150 };
    const radius = 120;
    const angleStep = (2 * Math.PI) / metrics.length;

    const getPoints = (metric: (typeof metrics)[0]) => {
      const index = metrics.indexOf(metric);
      const angle = index * angleStep - Math.PI / 2;
      const value = isRaw ? (metric.total / rawAxisScale) : (metric.score / 5);
      const normalizedValue = Math.pow(value, 0.7);

      return {
        x: center.x + radius * normalizedValue * Math.cos(angle),
        y: center.y + radius * normalizedValue * Math.sin(angle),
        label: {
          x: center.x + (radius + 30) * Math.cos(angle),
          y: center.y + (radius + 30) * Math.sin(angle)
        },
        value: isRaw ? metric.total : metric.score
      };
    };

    const points = metrics.map(m => getPoints(m));
    const polygonPath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

    const referenceLines = isRaw 
      ? [0.2, 0.4, 0.6, 0.8, 1].map(scale => ({
          radius: 120 * scale,
          label: Math.round(scale * rawAxisScale)
        }))
      : [0.2, 0.4, 0.6, 0.8, 1].map(scale => ({
          radius: 120 * scale,
          label: (scale * 5).toFixed(1)
        }));

    return (
      <div className="bg-[#282828] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium">
              {isRaw ? 'Distribuição de Questões' : 'Desempenho Normalizado'}
            </h3>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#1DB954] transition-colors cursor-help" />
              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 w-80 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-[#1e1e1e] rounded-lg p-4 shadow-lg border border-[#383838]">
                  <h4 className="text-[#1DB954] font-medium mb-2">
                    {isRaw ? 'Quantidade de Questões' : 'Métricas Normalizadas'}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {isRaw 
                      ? 'Mostra o número real de questões em cada nível da taxonomia.'
                      : 'Apresenta o desempenho normalizado considerando streak e domínio.'}
                  </p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-[#1e1e1e] 
                  transform rotate-45 border-r border-b border-[#383838]" />
              </div>
            </div>
          </div>
        </div>

        <svg width="400" height="400" className="mx-auto">
          <g transform="translate(50, 50)">
            {/* Reference circles */}
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

            {/* Axis lines */}
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

            {/* Level labels */}
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

            {/* Radar area */}
            <motion.path
              d={polygonPath}
              fill={isRaw ? "rgba(255, 107, 107, 0.2)" : "rgba(29, 185, 84, 0.2)"}
              stroke={isRaw ? "#FF6B6B" : "#1DB954"}
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Data points */}
            {points.map((point, i) => (
              <motion.g key={i}>
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill={isRaw ? "#FF6B6B" : metrics[i].color}
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
                  {isRaw ? point.value : point.value.toFixed(1)}
                </motion.text>
              </motion.g>
            ))}
          </g>
        </svg>

        {/* Legend */}
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
                  style={{ 
                    backgroundColor: isRaw ? '#FF6B6B20' : `${metric.color}20` 
                  }}
                >
                  <Icon 
                    className="w-4 h-4"
                    style={{ 
                      color: isRaw ? '#FF6B6B' : metric.color 
                    }}
                  />
                </div>
                <div>
                  <p className="text-white text-sm">{metric.level}</p>
                  <div className="text-xs text-gray-400">
                    {isRaw 
                      ? `${metric.total} questões`
                      : `Score: ${metric.score.toFixed(1)}`
                    }
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <SplitSquareHorizontal className="w-5 h-5 text-[#1DB954]" />
        <h3 className="text-white font-medium">Comparação da Taxonomia de Bloom</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart(normalizedMetrics, false)}
        {renderChart(rawMetrics, true)}
      </div>
    </div>
  );
};

export default BloomComparisonCharts;
