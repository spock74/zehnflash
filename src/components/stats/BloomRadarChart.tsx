import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Lightbulb, 
  Wrench, 
  Search, 
  Scale, 
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

// Previous interfaces remain the same...

const BloomRadarChart: React.FC<BloomRadarChartProps> = ({ flashcards }) => {
  const navigate = useNavigate();

  // Previous calculations remain the same...

  return (
    <div 
      className="bg-[#282828] rounded-xl p-6 group relative cursor-pointer transition-all hover:bg-[#2a2a2a]"
      onClick={() => navigate('/detailed-pedagogical-monitoring')}
    >
      {/* Tooltip overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 
        group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-xl z-10">
        <div className="bg-[#1e1e1e] px-4 py-2 rounded-full flex items-center gap-2 text-white">
          <span>Clique para detalhes</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Previous content remains the same... */}
    </div>
  );
};

export default BloomRadarChart;
