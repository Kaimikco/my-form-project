// ============================================
// Core Types
// ============================================

// Simple ID reference - no type needed since context provides that
export type IdRef = string;

// ============================================
// NPCs
// ============================================

export interface NPC {
  id: string;
  name: string;
  description: string;
  dialogue?: NpcDialogue;
  questIds?: IdRef[];  // Just string IDs
  inventoryIds?: IdRef[];
}

export interface NpcDialogue {
  greeting: string | string[];
  topics: DialogueTopic[];
}

export interface DialogueTopic {
  id: string; // Useful for tracking/debugging
  title: string; // What the player sees in the initial topic list
  initialResponse: string; // NPC's first response when topic is selected
  conversation: DialogueNode; // The back-and-forth conversation
  isAvailable?: () => boolean; // Optional condition check
}

export interface DialogueNode {
  playerOptions: PlayerOption[]; // What the player can say
}

export interface PlayerOption {
  text: string; // What the player says
  npcResponse: string; // How the NPC responds to this choice
  nextNode?: DialogueNode; // Continue the conversation
  action?: () => void; // Optional side effects (quest updates, etc.)
  endsConversation?: boolean; // Flag to close dialog
}

// ============================================
// Services (Buildings/Locations in Town)
// ============================================

export enum ServiceType {
  Tavern = 'tavern',
  FightersGuild = 'fighters-guild',
  MagesGuild = 'mages-guild',
  Blacksmith = 'blacksmith',
  GeneralStore = 'general-store',
  Temple = 'temple',
}

// Base service interface - common props for all services
export interface ServiceBase {
  id: string;
  type: ServiceType;
  name: string;
  description: string;
}

// Specific service types with their unique properties
export interface Tavern extends ServiceBase {
  type: ServiceType.Tavern;
  landlord: IdRef;
  patrons: IdRef[];
  roomsAvailable?: number;
  roomCost?: number;
  drinkIds?: IdRef[];
  rumors?: string[];
}

export interface Blacksmith extends ServiceBase {
  type: ServiceType.Blacksmith;
  weaponIds?: IdRef[];
  armorIds?: IdRef[];
  repairService?: boolean;
  upgradeService?: boolean;
}

export interface FightersGuild extends ServiceBase {
  type: ServiceType.FightersGuild;
  trainerIds?: IdRef[];
  questIds?: IdRef[];
  rankRequired?: number;
}

// Union type for all services
export type Service = Tavern | Blacksmith | FightersGuild;

// ============================================
// Towns
// ============================================

export interface Town {
  id: string;
  name: string;
  description: string;
  serviceIds: IdRef[];  // Just the service IDs
  population?: number;
  dangerLevel?: number;
  faction?: string;
}

// ============================================
// Items & Quests
// ============================================

export interface Item {
  id: string;
  name: string;
  description: string;
  value: number;
  weight?: number;
  type: 'weapon' | 'armor' | 'consumable' | 'misc';
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  rewardIds?: IdRef[];
  experienceReward?: number;
  goldReward?: number;
}

// ============================================
// Game Database
// ============================================

export interface GameDatabase {
  towns: Record<string, Town>;
  services: Record<string, Service>;
  npcs: Record<string, NPC>;
  items: Record<string, Item>;
  quests: Record<string, Quest>;
}

// ============================================
// Data Manager with Type-Safe Getters
// ============================================

export class GameDataManager {
  constructor(private db: GameDatabase) {}

  // Type-safe getters for each entity type
  getTown(id: string): Town | undefined {
    return this.db.towns[id];
  }

  getService(id: string): Service | undefined {
    return this.db.services[id];
  }

  getNPC(id: string): NPC | undefined {
    return this.db.npcs[id];
  }

  getItem(id: string): Item | undefined {
    return this.db.items[id];
  }

  getQuest(id: string): Quest | undefined {
    return this.db.quests[id];
  }

  // "Required" versions that throw if not found (for when you KNOW it exists)
  requireTown(id: string): Town {
    const town = this.getTown(id);
    if (!town) throw new Error(`Town not found: ${id}`);
    return town;
  }

  requireService(id: string): Service {
    const service = this.getService(id);
    if (!service) throw new Error(`Service not found: ${id}`);
    return service;
  }

  requireNPC(id: string): NPC {
    const npc = this.getNPC(id);
    if (!npc) throw new Error(`NPC not found: ${id}`);
    return npc;
  }

  requireItem(id: string): Item {
    const item = this.getItem(id);
    if (!item) throw new Error(`Item not found: ${id}`);
    return item;
  }

  requireQuest(id: string): Quest {
    const quest = this.getQuest(id);
    if (!quest) throw new Error(`Quest not found: ${id}`);
    return quest;
  }

  // Batch getters that filter out undefined automatically
  getMany<T>(ids: string[], getter: (id: string) => T | undefined): T[] {
    return ids
      .map(id => getter(id))
      .filter((item): item is T => item !== undefined);
  }

  getTowns(ids: string[]): Town[] {
    return this.getMany(ids, id => this.getTown(id));
  }

  getServices(ids: string[]): Service[] {
    return this.getMany(ids, id => this.getService(id));
  }

  getNPCs(ids: string[]): NPC[] {
    return this.getMany(ids, id => this.getNPC(id));
  }

  getItems(ids: string[]): Item[] {
    return this.getMany(ids, id => this.getItem(id));
  }

  getQuests(ids: string[]): Quest[] {
    return this.getMany(ids, id => this.getQuest(id));
  }

  // Convenience methods for common operations (already handle undefined gracefully)
  getTownServices(townId: string): Service[] {
    const town = this.getTown(townId);
    if (!town) return [];
    return this.getServices(town.serviceIds);
  }

  getNPCQuests(npcId: string): Quest[] {
    const npc = this.getNPC(npcId);
    if (!npc?.questIds) return [];
    return this.getQuests(npc.questIds);
  }

  // Check if entities exist
  hasTown(id: string): boolean {
    return this.getTown(id) !== undefined;
  }

  hasService(id: string): boolean {
    return this.getService(id) !== undefined;
  }

  hasNPC(id: string): boolean {
    return this.getNPC(id) !== undefined;
  }
}

// ============================================
// Example Data
// ============================================

const tavernKeeperGrim: NPC = {
    id: 'tavern-keeper-grim',
    name: 'Grim the Tavern Keeper',
    description: 'A bright red man with a shiny face, his face beaming from behind the dilapidated bar, at least there is some charm in this dismal place.',
    questIds: ['find-the-rat']
}

const smellyJeff: NPC = {
    id: 'smelly-jeff',
    name: "Smelly Jeff",
    description: "A rather foul smelling fellow, but he has a glint in his eye that suggest's some beyond the fetid odor...or maybe not.",
    dialogue: {
      greeting: ["Hello there!", "Good day!", "Greetings, traveler!"],
      topics: [
        {
          id: "shop",
          title: "Ask about the shop",
          initialResponse: "Ah yes, I run the finest blacksmith shop in town!",
          conversation: {
              playerOptions: [
                {
                  text: "What items do you sell?",
                  npcResponse: "I craft weapons, armor, and tools. Only the best quality!",
                  nextNode: {
                    playerOptions: [
                      {
                        text: "Show me your weapons",
                        npcResponse: "Here's my finest blade!",
                        endsConversation: true
                      },
                      {
                        text: "I'll come back later",
                        npcResponse: "Of course, take your time!",
                        endsConversation: true
                      }
                    ]
                  }
                },
                {
                  text: "How long have you been smithing?",
                  npcResponse: "For over 20 years! My father taught me the trade.",
                  endsConversation: true
                }
              ]
            }
        },
        {
          id: "quest",
          title: "Ask about local troubles",
          initialResponse: "There have been strange noises from the old mine...",
          conversation:
            {
              playerOptions: [
                {
                  text: "I could investigate for you",
                  npcResponse: "That would be wonderful! Be careful though.",
                  endsConversation: true
                },
                {
                  text: "Sounds dangerous",
                  npcResponse: "Indeed it is. Perhaps someone braver will help.",
                  endsConversation: true
                }
              ]
            }
        }
      ]
    }
}

const aywellTavern: Service = {
    id: 'aywell-tavern',
    type: ServiceType.Tavern,
    name: 'The Devious Jester',
    description: 'A gloomy rundown building entertaining the dregs of aywell with brown slop and warm ale, good luck finding a roach free bed here.',
    landlord: tavernKeeperGrim.id,
    patrons: [smellyJeff.id],
    roomsAvailable: 3,
    roomCost: 5,
    rumors: ['Strange lights have been seen in the old ruins...']    
}

const aywellBlacksmith: Service = {
    id: 'aywell-blacksmith',
    type: ServiceType.Blacksmith,
    name: 'Rusty Anvil',
    description: 'A suspect smithy echoing with the dull clank of a poorly aimed hammer...I guess we dont have much choice right now.',
    weaponIds: ['iron-sword'],
    repairService: true,
    upgradeService: false    
}

const aywell: Town = {
    id: 'aywell',
    name: 'Aywell',
    description: 'A dismal town, the drab populace gape at you glumly and wallow forlorn by their ramshackle houses. There is little more here than a few homes, a suspect tavern and a shop thats more likely to rob us than sell anything useful. It would be best to get out of here as soon as we can.',
    serviceIds: [aywellTavern.id, aywellBlacksmith.id],
    population: 250,
    dangerLevel: 2
}

export const gameDatabase: GameDatabase = {
  towns: {
    [aywell.id]: aywell
  },
  
  services: {
    [aywellTavern.id]: aywellTavern,
    [aywellBlacksmith.id]: aywellBlacksmith
  },
  
  npcs: {
    [tavernKeeperGrim.id]: tavernKeeperGrim,
    [smellyJeff.id]: smellyJeff,
  },
  
  items: {},
  
  quests: {}
};

// ============================================
// React Hook with Enhanced Error Handling
// ============================================

export function useGameData() {
  const manager = new GameDataManager(gameDatabase);
  
  return {
    // Regular getters (can return undefined)
    getTown: (id: string) => manager.getTown(id),
    getService: (id: string) => manager.getService(id),
    getNPC: (id: string) => manager.getNPC(id),
    getItem: (id: string) => manager.getItem(id),
    getQuest: (id: string) => manager.getQuest(id),
    
    // Required getters (throw if not found)
    requireTown: (id: string) => manager.requireTown(id),
    requireService: (id: string) => manager.requireService(id),
    requireNPC: (id: string) => manager.requireNPC(id),
    
    // Batch getters
    getServices: (ids: string[]) => manager.getServices(ids),
    getNPCs: (ids: string[]) => manager.getNPCs(ids),
    getItems: (ids: string[]) => manager.getItems(ids),
    
    // Convenience methods (always return arrays, never undefined)
    getTownServices: (townId: string) => manager.getTownServices(townId),
    getNPCQuests: (npcId: string) => manager.getNPCQuests(npcId),
    
    // Existence checks
    hasTown: (id: string) => manager.hasTown(id),
    hasService: (id: string) => manager.hasService(id),
    hasNPC: (id: string) => manager.hasNPC(id),
  };
}