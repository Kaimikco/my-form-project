import { create } from 'zustand';
import { animate } from 'framer-motion';
import type { Character, DamageNumber, BattlePhase } from './types';
import { TeamSide } from './types';

interface BattleState {
  // Game state
  playerTeam: Character[];
  enemyTeam: Character[];
  phase: BattlePhase;
  selectedAction: 'attack' | 'defend' | null;
  targetingEnemy: string | null;
  damageNumbers: DamageNumber[];
  
  // Animation refs
  characterRefs: Map<string, HTMLElement>;
  
  // Actions
  registerCharacterRef: (id: string, element: HTMLElement | null) => void;
  removeDamageNumber: (id: number) => void;
  selectAction: (action: 'attack' | 'defend') => void;
  setTargeting: (enemyId: string | null) => void;
  
  // Async animation actions
  startBattle: () => Promise<void>;
  playIntroSequence: () => Promise<void>;
  executeAttack: (attackerId: string, targetId: string) => Promise<void>;
  executeEnemyTurn: () => Promise<void>;
  playAttackAnimation: (attackerId: string, targetId: string, side: TeamSide) => Promise<void>;
  playDamageAnimation: (targetId: string, damage: number) => Promise<void>;
  playDeathAnimation: (characterId: string) => Promise<void>;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  // Initial state
  playerTeam: [
    { id: 'p1', name: 'Hero', hp: 100, maxHp: 100, side: TeamSide.PLAYER },
    { id: 'p2', name: 'Mage', hp: 80, maxHp: 80, side: TeamSide.PLAYER },
    { id: 'p3', name: 'Rogue', hp: 70, maxHp: 70, side: TeamSide.PLAYER },
  ],
  enemyTeam: [
    { id: 'e1', name: 'Goblin', hp: 50, maxHp: 50, side: TeamSide.ENEMY },
    { id: 'e2', name: 'Orc', hp: 60, maxHp: 60, side: TeamSide.ENEMY },
  ],
  
  phase: 'intro',
  selectedAction: null,
  targetingEnemy: null,
  damageNumbers: [],
  characterRefs: new Map(),
  
  // Register character element refs
  registerCharacterRef: (id: string, element: HTMLElement | null) => {
    const refs = new Map(get().characterRefs);
    if (element) {
      refs.set(id, element);
    } else {
      refs.delete(id);
    }
    set({ characterRefs: refs });
  },
  
  // Start battle with intro sequence
  startBattle: async () => {
    await get().playIntroSequence();
  },
  
  // Play intro animations for all characters
  playIntroSequence: async () => {
    const { playerTeam, enemyTeam, characterRefs } = get();
    const allCharacters = [...playerTeam, ...enemyTeam];
    
    // Create intro animations for all characters
    const animations = allCharacters.map(async (character, index) => {
      const element = characterRefs.get(character.id);
      if (!element) return;
      
      // Determine starting position based on side
      const startX = character.side === TeamSide.PLAYER ? -100 : 100;

      // Animate in with stagger
      await animate(
        element,
        { x: [startX, 0], opacity: [0, 1] },
        { delay: index * 0.1, duration: 0.3, ease: 'easeInOut' }
      );
    });
    
    // Wait for all intros to complete
    await Promise.all(animations);
    set({ phase: 'playerTurn' });
  },
  
  // Execute player attack
  executeAttack: async (attackerId: string, targetId: string) => {
    set({ phase: 'animating', selectedAction: null, targetingEnemy: null });
    
    const damage = Math.floor(Math.random() * 20 + 10);
    
    // Play attack animation
    await get().playAttackAnimation(attackerId, targetId, TeamSide.PLAYER);
    
    // Play damage animation and apply damage
    await get().playDamageAnimation(targetId, damage);
    
    // Apply damage to state
    set(state => ({
      enemyTeam: state.enemyTeam.map(e =>
        e.id === targetId 
          ? { ...e, hp: Math.max(0, e.hp - damage) }
          : e
      )
    }));
    
    // Check if target died
    const target = get().enemyTeam.find(e => e.id === targetId);
    if (target && target.hp <= 0) {
      await get().playDeathAnimation(targetId);
    }
    
    // Check win condition
    if (get().enemyTeam.every(e => e.hp <= 0)) {
      set({ phase: 'victory' });
    } else {
      // Continue to enemy turn
      await get().executeEnemyTurn();
    }
  },
  
  // Execute enemy turn
  executeEnemyTurn: async () => {
    set({ phase: 'enemyTurn' });
    
    const aliveEnemies = get().enemyTeam.filter(e => e.hp > 0);
    const alivePlayers = get().playerTeam.filter(p => p.hp > 0);
    
    if (aliveEnemies.length === 0 || alivePlayers.length === 0) {
      return;
    }
    
    // Simple AI - random enemy attacks random player
    const attacker = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    const damage = Math.floor(Math.random() * 15 + 5);
    
    // Wait a moment for player to see it's enemy turn
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Play attack animation
    await get().playAttackAnimation(attacker.id, target.id, TeamSide.ENEMY);
    
    // Play damage animation
    await get().playDamageAnimation(target.id, damage);
    
    // Apply damage
    set(state => ({
      playerTeam: state.playerTeam.map(p =>
        p.id === target.id
          ? { ...p, hp: Math.max(0, p.hp - damage) }
          : p
      )
    }));
    
    // Check if target died
    const targetPlayer = get().playerTeam.find(p => p.id === target.id);
    if (targetPlayer && targetPlayer.hp <= 0) {
      await get().playDeathAnimation(target.id);
    }
    
    // Check lose condition
    if (get().playerTeam.every(p => p.hp <= 0)) {
      set({ phase: 'defeat' });
    } else {
      set({ phase: 'playerTurn' });
    }
  },
  
  // Play attack animation
  playAttackAnimation: async (attackerId: string, targetId: string, attackerSide: TeamSide) => {
    const { characterRefs } = get();
    const attackerEl = characterRefs.get(attackerId);
    const targetEl = characterRefs.get(targetId);
    
    if (!attackerEl || !targetEl) return;
    
    // Attacker moves forward
    const moveDistance = attackerSide === TeamSide.PLAYER ? 30 : -30;
    await animate(
      attackerEl, 
      { scale: 1.1, x: moveDistance }, 
      { duration: 0.2, ease: 'easeOut' }
    );
    
    // Target gets hit (shake)
    await animate(
      targetEl,
      { x: [0, -10, 10, -10, 0] },
      { duration: 0.3, ease: 'easeInOut' }
    );
    
    // Attacker returns
    await animate(
      attackerEl,
      { scale: 1, x: 0 },
      { duration: 0.2, ease: 'easeIn' }
    );
  },
  
  // Play damage animation and show damage number
  playDamageAnimation: async (targetId: string, damage: number) => {
    const { characterRefs } = get();
    const targetEl = characterRefs.get(targetId);
    
    if (targetEl) {
      // Flash red
      const originalBg = targetEl.style.backgroundColor;
      targetEl.style.backgroundColor = 'rgba(239, 68, 68, 0.5)';
      
      // Create damage number
      set(state => ({
        damageNumbers: [...state.damageNumbers, {
          id: Date.now(),
          value: damage,
          targetId
        }]
      }));
      
      // Reset background after brief delay
      await new Promise(resolve => setTimeout(resolve, 200));
      targetEl.style.backgroundColor = originalBg;
    }
  },
  
  // Play death animation
  playDeathAnimation: async (characterId: string) => {
    const { characterRefs } = get();
    const element = characterRefs.get(characterId);
    
    if (element) {
      await animate(
        element,
        { opacity: 0.3, scale: 0.9, filter: 'grayscale(100%)' },
        { duration: 0.5, ease: 'easeOut' }
      );
    }
  },
  
  // UI Actions
  removeDamageNumber: (id: number) => {
    set(state => ({
      damageNumbers: state.damageNumbers.filter(d => d.id !== id)
    }));
  },
  
  selectAction: (action: 'attack' | 'defend') => {
    set({ selectedAction: action, targetingEnemy: null });
  },
  
  setTargeting: (enemyId: string | null) => {
    set({ targetingEnemy: enemyId });
  }
}));