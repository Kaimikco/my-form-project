import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useBattleStore } from '../store';
import { CharacterCard } from './CharacterCard';
import { DamageNumber } from './DamageNumber';
import { ActionMenu } from './ActionMenu';

export const BattleScreen: React.FC = () => {
  const { playerTeam, enemyTeam, phase, damageNumbers, startBattle } = useBattleStore();
  
  useEffect(() => {
    // Start the battle intro sequence
    startBattle();
  }, []);
  
  return (
    <div className="battle-screen min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          ⚔️ Battle!
        </h1>
        
        {/* Enemy team */}
        <div className="flex justify-center gap-4 mb-12">
          {enemyTeam.map((enemy, i) => (
            <div key={enemy.id} className="relative">
              <CharacterCard character={enemy} index={i} />
              {/* Damage numbers */}
              <AnimatePresence>
                {damageNumbers
                  .filter(d => d.targetId === enemy.id)
                  .map(damage => (
                    <DamageNumber key={damage.id} damage={damage} />
                  ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        {/* Player team */}
        <div className="flex justify-center gap-4 mb-8">
          {playerTeam.map((player, i) => (
            <div key={player.id} className="relative">
              <CharacterCard character={player} index={i} />
              {/* Damage numbers */}
              <AnimatePresence>
                {damageNumbers
                  .filter(d => d.targetId === player.id)
                  .map(damage => (
                    <DamageNumber key={damage.id} damage={damage} />
                  ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        {/* Action UI */}
        <div className="flex justify-center">
          <ActionMenu 
            disabled={phase === 'animating' || phase === 'intro' || phase === 'enemyTurn'} 
          />
        </div>
      </div>
    </div>
  );
};