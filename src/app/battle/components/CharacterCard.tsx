import React, { useRef, useEffect } from 'react';
import { useBattleStore } from '../store';
import { HealthBar } from './HealthBar';
import type { Character } from '../types';
import { TeamSide } from '../types';
import { tv } from 'tailwind-variants';

export const characterCard = tv({
  base: "character-card relative p-4 rounded-lg transition-all",
  variants: {
    team: {
      player: "bg-blue-900",
      enemy: "bg-red-900"
    },
    targetable: {
      true: "cursor-pointer hover:scale-105",
      false: ""
    },
    targeted: {
      true: "ring-4 ring-yellow-400",
      false: ""
    },
    defeated: {
      true: "opacity-30 grayscale",
      false: ""
    }
  }
});

interface CharacterCardProps {
  character: Character;
  index: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, index }) => {
  const { 
    phase, 
    selectedAction, 
    targetingEnemy, 
    executeAttack, 
    setTargeting, 
    registerCharacterRef 
  } = useBattleStore();
  
  const ref = useRef<HTMLDivElement>(null);
  
  const isPlayer = character.side === TeamSide.PLAYER;
  const isTargetable = !isPlayer && selectedAction === 'attack' && phase === 'playerTurn' && character.hp > 0;
  const isTargeted = targetingEnemy === character.id;
  const isDefeated = character.hp <= 0;
  
  useEffect(() => {
    // Register this element with the store
    if (ref.current) {
      registerCharacterRef(character.id, ref.current);
    }
    
    return () => {
      registerCharacterRef(character.id, null);
    };
  }, [character.id, registerCharacterRef]);
  
  const handleClick = () => {
    if (isTargetable && targetingEnemy === character.id) {
      // Find first alive player
      const attacker = useBattleStore.getState().playerTeam.find(p => p.hp > 0);
      if (attacker) {
        executeAttack(attacker.id, character.id);
      }
    }
  };
  
  const handleHover = () => {
    if (isTargetable) {
      setTargeting(character.id);
    }
  };
  
  const handleLeave = () => {
    if (isTargetable) {
      setTargeting(null);
    }
  };
  
  return (
    <div
      ref={ref}
      className={characterCard({
        team: isPlayer ? 'player' : 'enemy',
        targetable: isTargetable,
        targeted: isTargeted,
        defeated: isDefeated
      })}
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <div className="text-white font-bold mb-2">{character.name}</div>
      <div className="w-32 h-20 bg-gray-600 rounded mb-2 flex items-center justify-center">
        <span className="text-4xl">{isPlayer ? '🗡️' : '👹'}</span>
      </div>
      <HealthBar current={character.hp} max={character.maxHp} />
    </div>
  );
};