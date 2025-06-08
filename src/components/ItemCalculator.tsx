
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FiestaItem, ItemType, ItemRarity, CharacterClass } from '@/types/fiesta';
import { FiestaCalculator } from '@/utils/fiestaCalculator';
import CurrencyDisplay from './CurrencyDisplay';
import { Calculator, Zap, Star, TrendingUp } from 'lucide-react';

const ItemCalculator = () => {
  const [item, setItem] = useState<FiestaItem>({
    id: 'custom',
    name: '',
    type: ItemType.WEAPON,
    level: 1,
    basePrice: 100,
    rarity: ItemRarity.COMMON,
    stats: {},
    enhancement: 0,
    quality: 50
  });

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [marketTips, setMarketTips] = useState<string[]>([]);

  useEffect(() => {
    const price = FiestaCalculator.calculateItemPrice(item);
    setCalculatedPrice(price);
    setMarketTips(FiestaCalculator.getMarketTips(item, price));
  }, [item]);

  const updateItem = (updates: Partial<FiestaItem>) => {
    setItem(prev => ({ ...prev, ...updates }));
  };

  const updateStats = (stat: string, value: number) => {
    setItem(prev => ({
      ...prev,
      stats: { ...prev.stats, [stat]: value }
    }));
  };

  const currency = FiestaCalculator.convertCurrency(calculatedPrice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            Fiesta Online Preisrechner
          </h1>
          <p className="text-gray-300 text-lg">Berechne den optimalen Preis für deine Items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Item-Eingabe */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Calculator className="h-5 w-5" />
                Item-Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="itemName" className="text-gray-300">Item Name</Label>
                  <Input
                    id="itemName"
                    value={item.name}
                    onChange={(e) => updateItem({ name: e.target.value })}
                    placeholder="z.B. Dragon Sword"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="itemLevel" className="text-gray-300">Level</Label>
                  <Input
                    id="itemLevel"
                    type="number"
                    min="1"
                    max="150"
                    value={item.level}
                    onChange={(e) => updateItem({ level: parseInt(e.target.value) || 1 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Item-Typ</Label>
                  <Select value={item.type} onValueChange={(value) => updateItem({ type: value as ItemType })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value={ItemType.WEAPON}>Waffe</SelectItem>
                      <SelectItem value={ItemType.ARMOR}>Rüstung</SelectItem>
                      <SelectItem value={ItemType.SHIELD}>Schild</SelectItem>
                      <SelectItem value={ItemType.ACCESSORY}>Accessoire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Seltenheit</Label>
                  <Select value={item.rarity} onValueChange={(value) => updateItem({ rarity: value as ItemRarity })}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value={ItemRarity.COMMON}>Normal</SelectItem>
                      <SelectItem value={ItemRarity.RARE}>Selten</SelectItem>
                      <SelectItem value={ItemRarity.EPIC}>Episch</SelectItem>
                      <SelectItem value={ItemRarity.LEGENDARY}>Legendär</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Klassen-Beschränkung</Label>
                <Select 
                  value={item.classRestriction || 'none'} 
                  onValueChange={(value) => updateItem({ classRestriction: value === 'none' ? undefined : value as CharacterClass })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Keine Beschränkung" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="none">Keine Beschränkung</SelectItem>
                    <SelectItem value={CharacterClass.GLADIATOR}>Gladiator</SelectItem>
                    <SelectItem value={CharacterClass.JOKER}>Joker</SelectItem>
                    <SelectItem value={CharacterClass.MAGE}>Magier</SelectItem>
                    <SelectItem value={CharacterClass.HUNTER}>Jäger</SelectItem>
                    <SelectItem value={CharacterClass.CRUSADER}>Kreuzritter</SelectItem>
                    <SelectItem value={CharacterClass.PRIEST}>Priester</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Verstärkung: +{item.enhancement}
                </Label>
                <Slider
                  value={[item.enhancement]}
                  onValueChange={(value) => updateItem({ enhancement: value[0] })}
                  max={9}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Qualität: {item.quality}% {item.quality >= 95 ? '(BLAU!)' : ''}
                </Label>
                <Slider
                  value={[item.quality]}
                  onValueChange={(value) => updateItem({ quality: value[0] })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-400 mt-1">
                  {item.quality < 50 && 'Schlechte Stats'}
                  {item.quality >= 50 && item.quality < 80 && 'Normale Stats'}
                  {item.quality >= 80 && item.quality < 95 && 'Gute Stats'}
                  {item.quality >= 95 && 'Blaue Stats - Premium!'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats-Eingabe */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">Item-Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stamina" className="text-gray-300">Ausdauer</Label>
                  <Input
                    id="stamina"
                    type="number"
                    min="0"
                    value={item.stats.stamina || ''}
                    onChange={(e) => updateStats('stamina', parseInt(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="dexterity" className="text-gray-300">Geschicklichkeit</Label>
                  <Input
                    id="dexterity"
                    type="number"
                    min="0"
                    value={item.stats.dexterity || ''}
                    onChange={(e) => updateStats('dexterity', parseInt(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="intelligence" className="text-gray-300">Intelligenz</Label>
                  <Input
                    id="intelligence"
                    type="number"
                    min="0"
                    value={item.stats.intelligence || ''}
                    onChange={(e) => updateStats('intelligence', parseInt(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="strength" className="text-gray-300">Stärke</Label>
                  <Input
                    id="strength"
                    type="number"
                    min="0"
                    value={item.stats.strength || ''}
                    onChange={(e) => updateStats('strength', parseInt(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="constitution" className="text-gray-300">Konstitution</Label>
                  <Input
                    id="constitution"
                    type="number"
                    min="0"
                    value={item.stats.constitution || ''}
                    onChange={(e) => updateStats('constitution', parseInt(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="damage" className="text-gray-300">Schaden</Label>
                  <Input
                    id="damage"
                    type="number"
                    min="0"
                    value={item.stats.damage || ''}
                    onChange={(e) => updateStats('damage', parseInt(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="basePrice" className="text-gray-300">Basis-Preis (Kupfer)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="1"
                  value={item.basePrice}
                  onChange={(e) => updateItem({ basePrice: parseInt(e.target.value) || 100 })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ergebnis */}
        <Card className="mt-6 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-600">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-yellow-400">
              Berechneter Preis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-white mb-2">
                {calculatedPrice.toLocaleString()} Kupfer
              </div>
              <CurrencyDisplay currency={currency} className="justify-center text-lg" />
            </div>

            {marketTips.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Markt-Tipps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {marketTips.map((tip, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-700 text-gray-300 border-slate-600">
                      {tip}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItemCalculator;
