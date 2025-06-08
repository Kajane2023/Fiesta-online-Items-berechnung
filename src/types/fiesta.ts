
export interface FiestaItem {
  id: string;
  name: string;
  type: ItemType;
  level: number;
  basePrice: number;
  rarity: ItemRarity;
  classRestriction?: CharacterClass;
  stats: ItemStats;
  enhancement: number; // +0 to +9
  quality: number; // 0-100%
}

export interface ItemStats {
  stamina?: number;
  dexterity?: number;
  intelligence?: number;
  strength?: number;
  constitution?: number;
  damage?: number;
  defense?: number;
  magicDefense?: number;
}

export enum ItemType {
  WEAPON = 'weapon',
  ARMOR = 'armor',
  SHIELD = 'shield',
  ACCESSORY = 'accessory'
}

export enum ItemRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum CharacterClass {
  GLADIATOR = 'gladiator',
  JOKER = 'joker',
  MAGE = 'mage',
  HUNTER = 'hunter',
  CRUSADER = 'crusader',
  PRIEST = 'priest'
}

export interface Currency {
  copper: number;
  silver: number;
  gold: number;
  gems: number;
}

export interface MarketTrend {
  demand: number; // 0-200%
  supply: number; // 0-200%
  trend: 'rising' | 'falling' | 'stable';
}
