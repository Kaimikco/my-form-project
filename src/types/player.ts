export interface Player {
    id: string;
    name: string;
    stats: PlayerStats;
}

export interface PlayerStats {
    health: number;
    stamina: number;
}