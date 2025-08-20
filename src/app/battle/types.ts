export enum TeamSide {
  PLAYER = 'player',
  ENEMY = 'enemy'
}

export interface Character {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  side: TeamSide;
}

export interface DamageNumber {
  id: number;
  value: number;
  targetId: string;
  x?: number;
  y?: number;
}

export type BattlePhase = 'intro' | 'playerTurn' | 'enemyTurn' | 'animating' | 'victory' | 'defeat';