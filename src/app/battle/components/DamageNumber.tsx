import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBattleStore } from '../store';
import type { DamageNumber as DamageNumberType } from '../types';

interface DamageNumberProps {
  damage: DamageNumberType;
}

export const DamageNumber: React.FC<DamageNumberProps> = ({ damage }) => {
  const { removeDamageNumber } = useBattleStore();
  
  useEffect(() => {
    // Remove after animation completes
    const timer = setTimeout(() => {
      removeDamageNumber(damage.id);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [damage.id, removeDamageNumber]);
  
  return (
    <motion.div
      className="absolute text-3xl font-bold text-red-500 pointer-events-none z-50"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: -50 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      -{damage.value}
    </motion.div>
  );
};