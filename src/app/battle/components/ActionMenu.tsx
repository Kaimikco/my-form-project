import React from 'react';
import { motion } from 'framer-motion';
import { useBattleStore } from '../store';
import { tv } from 'tailwind-variants';

interface ActionMenuProps {
  disabled: boolean;
}

export const actionButton = tv({
  base: "px-6 py-2 rounded text-white transition-colors disabled:opacity-50",
  variants: {
    variant: {
      attack: "bg-blue-500 hover:bg-blue-600",
      defend: "bg-green-500 hover:bg-green-600"
    },
    selected: {
      true: "ring-2 ring-white",
      false: ""
    }
  }
});

export const actionMenu = tv({
  base: "bg-gray-800 p-4 rounded-lg",
  variants: {
    disabled: {
      true: "opacity-50",
      false: ""
    }
  }
});

export const ActionMenu: React.FC<ActionMenuProps> = ({ disabled }) => {
  const { selectedAction, selectAction, phase } = useBattleStore();
  
  if (phase === 'victory' || phase === 'defeat') {
    return (
      <motion.div 
        className="bg-gray-800 p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white">
          {phase === 'victory' ? '🎉 Victory!' : '💀 Defeat...'}
        </h2>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={actionMenu({ disabled })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="text-white mb-2">
        {phase === 'intro' ? 'Get ready!' :
         phase === 'enemyTurn' ? "Enemy's Turn..." : 
         selectedAction === 'attack' ? 'Select a target!' : 'Choose an action:'}
      </div>
      <div className="flex gap-2">
        <button
          className={actionButton({ 
            variant: 'attack', 
            selected: selectedAction === 'attack' 
          })}
          onClick={() => selectAction('attack')}
          disabled={disabled}
        >
          ⚔️ Attack
        </button>
        <button
          className={actionButton({ 
            variant: 'defend', 
            selected: selectedAction === 'defend' 
          })}
          onClick={() => selectAction('defend')}
          disabled={disabled}
        >
          🛡️ Defend
        </button>
      </div>
    </motion.div>
  );
};