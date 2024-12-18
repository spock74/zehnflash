import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  BarChart2
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import BloomRadarChart from '../stats/BloomRadarChart';

export const DetailedMonitoring = () => {
  const navigate = useNavigate();
  const { flashcards, stats } = useStore();

  // Calculate detailed metrics
  const bloomLevels = flashcards.reduce((acc, card) => {
    const level = card.metadata?.bloomLevel || 'Não classificado';
    if (!acc[level]) {
      acc[level] = {
        total: 0,
        mastered: 0,
        averageStreak: 0,
        streaks: [],
        lastReviewed: null
      };
    }
    
    acc[level].total += 1;
    if ((card.streak || 0) >= 3) acc[level].mastered += 1;
    acc[level].streaks.push(card.streak || 0);
    if (card.lastReviewed) {
      const reviewDate = new Date(card.lastReviewed);
      if (!acc[level].lastReviewed || reviewDate > acc[level].lastReviewed) {
        acc[level].lastReviewed = reviewDate;
      }
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  Object.keys(bloomLevels).forEach(level => {
    const { streaks } = bloomLevels[level];
    bloomLevels[level].averageStreak = 
      streaks.length > 0 
        ? streaks.reduce((a: number, b: number) => a + b, 0) / streaks.length 
        : 0;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-[#1DB954]" />
          <h2 className="text-2xl font-bold text-white">
            Acompanhamento Pedagógico Detalhado
          </h2>
        </div>
        <button
          onClick={() => navigate('/stats')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#282828] text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BloomRadarChart flashcards={flashcards} />
        </motion.div>

        {/* Performance Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Linha do Tempo de Performance</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(bloomLevels).map(([level, data]) => (
              <div key={level} className="bg-[#1e1e1e] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#1DB954]" />
                    <span className="text-white font-medium">{level}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {data.mastered} de {data.total} dominados
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-400">Taxa de Domínio</p>
                    <p className="text-lg font-bold text-white">
                      {((data.mastered / data.total) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sequência Média</p>
                    <p className="text-lg font-bold text-white">
                      {data.averageStreak.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Última Revisão</p>
                    <p className="text-lg font-bold text-white">
                      {data.lastReviewed 
                        ? new Date(data.lastReviewed).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Objetivos de Aprendizado</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Progresso Geral</span>
              <span className="text-white font-bold">
                {((Object.values(bloomLevels).reduce((acc, data) => 
                  acc + data.mastered, 0) / flashcards.length) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-[#383838] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#1DB954]"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(Object.values(bloomLevels).reduce((acc, data) => 
                    acc + data.mastered, 0) / flashcards.length) * 100}%` 
                }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Frequência de Estudo</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">
              {(stats.cardsReviewed / (stats.studyTime / (24 * 60 * 60))).toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">Cartões por dia em média</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Tempo de Estudo</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">
              {Math.floor(stats.studyTime / 3600)}h {Math.floor((stats.studyTime % 3600) / 60)}m
            </p>
            <p className="text-sm text-gray-400">Tempo total dedicado</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
