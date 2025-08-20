import React from 'react';
import { motion } from 'framer-motion';

interface HealthBarProps {
  current: number;
  max: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ current, max }) => {
  const percentage = (current / max) * 100;
  
  return (
    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-green-500 to-green-400"
        initial={{ width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          backgroundColor: percentage > 50 ? '#10b981' : percentage > 25 ? '#eab308' : '#ef4444'
        }}
      />
      <div className="text-xs text-center text-white -mt-4">
        {current}/{max}
      </div>
    </div>
  );
};