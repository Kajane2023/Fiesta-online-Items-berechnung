
import { FiestaItem, CharacterClass, ItemType, ItemRarity, Currency, MarketTrend } from '@/types/fiesta';

// Preisberechnung-Konstanten
const ENHANCEMENT_MULTIPLIERS = {
  0: 1.0,
  1: 1.2,
  2: 1.5,
  3: 2.0,
  4: 2.8,
  5: 4.0,
  6: 6.5,
  7: 11.0,
  8: 20.0,
  9: 40.0
};

const CLASS_DEMAND_FACTORS = {
  [CharacterClass.GLADIATOR]: 1.3,
  [CharacterClass.JOKER]: 1.3,
  [CharacterClass.MAGE]: 1.2,
  [CharacterClass.HUNTER]: 0.9,
  [CharacterClass.CRUSADER]: 0.8,
  [CharacterClass.PRIEST]: 0.7
};

const STAT_WEIGHTS = {
  stamina: 1.0,
  dexterity: 1.0,
  intelligence: 0.8,
  strength: 0.9,
  constitution: 0.8,
  damage: 1.5,
  defense: 1.2,
  magicDefense: 1.1
};

const RARITY_MULTIPLIERS = {
  [ItemRarity.COMMON]: 1.0,
  [ItemRarity.RARE]: 1.5,
  [ItemRarity.EPIC]: 2.5,
  [ItemRarity.LEGENDARY]: 4.0
};

export class FiestaCalculator {
  static calculateItemPrice(item: FiestaItem, marketTrend?: MarketTrend): number {
    let price = item.basePrice;

    // Level-basierter Grundpreis
    price *= (1 + (item.level / 100));

    // Stats-Bonus berechnen
    const statsBonus = this.calculateStatsBonus(item.stats);
    price *= (1 + statsBonus);

    // Verstärkung anwenden
    const enhancementMultiplier = ENHANCEMENT_MULTIPLIERS[item.enhancement as keyof typeof ENHANCEMENT_MULTIPLIERS] || 1;
    price *= enhancementMultiplier;

    // Seltenheit
    price *= RARITY_MULTIPLIERS[item.rarity];

    // Klassenspezifische Nachfrage
    if (item.classRestriction) {
      price *= CLASS_DEMAND_FACTORS[item.classRestriction];
    }

    // Qualitätsfaktor - exponentiell für hohe Werte (KORRIGIERT!)
    const qualityBonus = this.calculateQualityBonus(item.quality);
    price *= qualityBonus;

    // Markttrend berücksichtigen
    if (marketTrend) {
      const trendFactor = (marketTrend.demand / 100) / (marketTrend.supply / 100);
      price *= Math.min(Math.max(trendFactor, 0.5), 3.0); // Begrenzt auf 50%-300%
    }

    return Math.round(price);
  }

  private static calculateQualityBonus(quality: number): number {
    if (quality <= 50) {
      // Unterhalb 50% - Malus
      return 0.3 + (quality / 50) * 0.7; // 30% bis 100%
    } else if (quality <= 80) {
      // 50-80% - linearer Anstieg
      return 1.0 + ((quality - 50) / 30) * 0.5; // 100% bis 150%
    } else if (quality <= 95) {
      // 80-95% - starker Anstieg
      return 1.5 + ((quality - 80) / 15) * 1.5; // 150% bis 300%
    } else {
      // 95%+ - exponentieller Anstieg für "blaue" Items
      const excessQuality = quality - 95;
      return 3.0 + Math.pow(excessQuality / 5, 2) * 2.0; // 300% bis 800%+ für perfekte Items
    }
  }

  private static calculateStatsBonus(stats: any): number {
    let bonus = 0;
    
    Object.entries(stats).forEach(([stat, value]) => {
      if (typeof value === 'number' && value > 0) {
        const weight = STAT_WEIGHTS[stat as keyof typeof STAT_WEIGHTS] || 1;
        bonus += (value / 100) * weight;
      }
    });

    return Math.min(bonus, 2.0); // Max 200% Stats-Bonus
  }

  static convertCurrency(copper: number): Currency {
    const gems = Math.floor(copper / 1000000);
    const remaining1 = copper % 1000000;
    
    const gold = Math.floor(remaining1 / 10000);
    const remaining2 = remaining1 % 10000;
    
    const silver = Math.floor(remaining2 / 100);
    const finalCopper = remaining2 % 100;

    return {
      copper: finalCopper,
      silver,
      gold,
      gems
    };
  }

  static getMarketTips(item: FiestaItem, price: number): string[] {
    const tips: string[] = [];

    if (item.enhancement >= 7) {
      tips.push('🔥 Sehr hohe Verstärkung - Top-Preis möglich!');
    }

    if (item.quality >= 95) {
      tips.push('💎 Blaue Stats - Extremer Premium-Preis!');
    } else if (item.quality >= 90) {
      tips.push('⭐ Perfekte Stats - Premium-Preis gerechtfertigt');
    }

    if (item.classRestriction === CharacterClass.GLADIATOR || item.classRestriction === CharacterClass.JOKER) {
      tips.push('💰 Hohe Nachfrage durch DPS-Klassen');
    }

    if (price > 1000000) {
      tips.push('💎 High-End Item - Verkauf in Gems empfohlen');
    }

    if (item.level >= 100) {
      tips.push('🎯 Endgame-Item - Stabile Nachfrage');
    }

    if (item.quality >= 95 && item.enhancement >= 5) {
      tips.push('🚀 Sammlerstück - Kann 5-10x über Standardpreis verkauft werden!');
    }

    return tips;
  }
}
