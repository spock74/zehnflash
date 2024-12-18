import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Trophy,
  BrainCircuit,
  Flame,
  TrendingUp,
  CheckCircle2,
  Book
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import BloomRadarChart from './BloomRadarChart';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  subtitle
}: { 
  title: string; 
  value: string | number; 
  icon: any;
  color: string;
  subtitle?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#282828] rounded-xl p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-white font-medium">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
    {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
  </motion.div>
);

const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="h-2 bg-[#383838] rounded-full">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
};

const StreakGraph = ({ streaks }: { streaks: number[] }) => {
  const maxHeight = 100;
  const lastStreaks = streaks.slice(-10);

  return (
    <div className="h-32 flex items-end gap-1">
      {lastStreaks.map((streak, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(streak / 10) * maxHeight}%` }}
          className="flex-1 bg-[#1DB954] rounded-t"
          style={{ opacity: 0.3 + (index / lastStreaks.length) * 0.7 }}
        />
      ))}
    </div>
  );
};

export const StatisticsView = () => {
  const { flashcards, stats } = useStore();

  // Cálculos estatísticos
  const totalCards = flashcards.length;
  const cardsToReview = flashcards.filter(card => {
    if (!card.nextReview) return true;
    return new Date(card.nextReview) <= new Date();
  }).length;

  const masteredCards = flashcards.filter(card => (card.streak || 0) >= 5).length;
  const masteredPercentage = totalCards > 0 ? (masteredCards / totalCards) * 100 : 0;

  const averageStreak = flashcards.reduce((acc, card) => acc + (card.streak || 0), 0) / totalCards || 0;

  const accuracy = stats.cardsReviewed > 0 
    ? (stats.correctAnswers / stats.cardsReviewed) * 100 
    : 0;

  const studyTimeHours = Math.floor(stats.studyTime / 3600);
  const studyTimeMinutes = Math.floor((stats.studyTime % 3600) / 60);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-[#1DB954]" />
        <h2 className="text-2xl font-bold text-white">Estatísticas</h2>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Cartões"
          value={totalCards}
          icon={BrainCircuit}
          color="bg-blue-500"
          subtitle="Em todos os baralhos"
        />
        <StatCard
          title="Para Revisar"
          value={cardsToReview}
          icon={Calendar}
          color="bg-purple-500"
          subtitle="Cartões pendentes"
        />
        <StatCard
          title="Taxa de Acerto"
          value={`${accuracy.toFixed(1)}%`}
          icon={Target}
          color="bg-green-500"
          subtitle={`${stats.correctAnswers} de ${stats.cardsReviewed} corretos`}
        />
        <StatCard
          title="Cartões Dominados"
          value={`${masteredPercentage.toFixed(1)}%`}
          icon={Trophy}
          color="bg-amber-500"
          subtitle={`${masteredCards} cartões`}
        />
      </div>

      {/* Gráfico Radar de Bloom e Progresso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Gráfico Radar de Bloom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BloomRadarChart flashcards={flashcards} />
        </motion.div>

        {/* Progresso de Aprendizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Progresso de Aprendizado</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Cartões Dominados</span>
                <span className="text-white">{masteredCards} de {totalCards}</span>
              </div>
              <ProgressBar 
                value={masteredCards} 
                max={totalCards} 
                color="bg-[#1DB954]" 
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Taxa de Acerto</span>
                <span className="text-white">{accuracy.toFixed(1)}%</span>
              </div>
              <ProgressBar 
                value={accuracy} 
                max={100} 
                color="bg-green-500" 
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Sequência Média</span>
                <span className="text-white">{averageStreak.toFixed(1)} acertos</span>
              </div>
              <ProgressBar 
                value={averageStreak} 
                max={10} 
                color="bg-amber-500" 
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Histórico de Sequências e Detalhes de Estudo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico de Sequências */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Histórico de Sequências</h3>
          </div>
          
          <StreakGraph streaks={stats.streaks} />
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Maior Sequência</p>
              <p className="text-2xl font-bold text-white">
                {Math.max(...stats.streaks, 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Sequência Atual</p>
              <p className="text-2xl font-bold text-white">
                {stats.streaks[stats.streaks.length - 1] || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Média</p>
              <p className="text-2xl font-bold text-white">
                {(stats.streaks.reduce((a, b) => a + b, 0) / stats.streaks.length || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Detalhes de Estudo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Book className="w-5 h-5 text-[#1DB954]" />
            <h3 className="text-white font-medium">Detalhes de Estudo</h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Tempo Total</p>
              <p className="text-2xl font-bold text-white">
                {studyTimeHours}h {studyTimeMinutes}m
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Cartões Revisados</p>
              <p className="text-2xl font-bold text-white">{stats.cardsReviewed}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Média por Sessão</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(stats.cardsReviewed / (stats.studyTime / 3600) || 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Última Revisão</p>
              <p className="text-2xl font-bold text-white">
                {new Date(stats.lastStudyDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
