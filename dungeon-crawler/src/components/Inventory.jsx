import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Sword, Shield, Zap } from 'lucide-react';

// Import item sprites
import ironSword from '../assets/sprites/items/iron_sword.png';
import royalSword from '../assets/sprites/items/royal_sword.png';
import enchantedBlade from '../assets/sprites/items/enchanted_blade.png';
import spikedMace from '../assets/sprites/items/spiked_mace.png';
import battleAxe from '../assets/sprites/items/battle_axe.png';
import crystalSpear from '../assets/sprites/items/crystal_spear.png';
import leatherArmor from '../assets/sprites/items/leather_armor.png';
import healthPotion from '../assets/sprites/items/health_potion.png';
import inventorySlot from '../assets/sprites/ui/inventory_slot.png';

const Inventory = ({ inventory, player, onUseItem, onUnequipItem, onEquipItem }) => {

  const getItemSprite = (item) => {
    // Weapon sprites
    if (item.sprite === 'iron_sword.png') return ironSword;
    if (item.sprite === 'royal_sword.png') return royalSword;
    if (item.sprite === 'enchanted_blade.png') return enchantedBlade;
    if (item.sprite === 'spiked_mace.png') return spikedMace;
    if (item.sprite === 'battle_axe.png') return battleAxe;
    if (item.sprite === 'crystal_spear.png') return crystalSpear;
    
    // Armor sprites
    if (item.sprite === 'leather_armor.png') return leatherArmor;
    
    // Consumable sprites
    if (item.sprite === 'health_potion.png') return healthPotion;
    
    // Fallback to iron sword
    return ironSword;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-300';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-orange-400';
      default: return 'text-gray-300';
    }
  };

  const handleItemClick = (item, index) => {
    if (item.type === 'consumable') {
      onUseItem(item, index);
    } else if (item.type === 'weapon' || item.type === 'armor') {
      // Equip weapons and armor
      if (onEquipItem) {
        onEquipItem(item, index);
      }
    }
  };

  const handleUnequip = (itemType) => {
    if (onUnequipItem) {
      onUnequipItem(itemType);
    }
  };

  return (
    <div className="fantasy-card p-6">
      <div className="mb-4">
        <h2 className="fantasy-title text-xl flex items-center gap-2">
          <Package className="w-6 h-6" />
          🎒 Inventory
        </h2>
      </div>
      <div className="space-y-6">
        {/* Equipment Slots */}
        <div className="space-y-4">
          <h4 className="fantasy-text text-lg font-bold">⚔️ Equipment</h4>
          
          {/* Weapon Slot */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 w-24">
              <Sword className="w-5 h-5 text-amber-400" />
              <span className="fantasy-text text-sm">Weapon</span>
            </div>
            <div 
              className="fantasy-slot w-16 h-16 flex items-center justify-center cursor-pointer"
              onClick={() => inventory.weapon && handleUnequip('weapon')}
            >
              {inventory.weapon && (
                <div className="relative">
                  <img 
                    src={getItemSprite(inventory.weapon)} 
                    alt={inventory.weapon.name}
                    className="w-12 h-12 image-rendering-pixelated"
                    title={`${inventory.weapon.name} (Attack: +${inventory.weapon.attack})`}
                  />
                  <div className={`absolute -top-1 -right-1 text-xs ${getRarityColor(inventory.weapon.rarity)}`}>
                    <Zap className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
            {inventory.weapon && (
              <div className="fantasy-text text-sm font-bold">
                +{inventory.weapon.attack} ATK
              </div>
            )}
          </div>
          
          {/* Armor Slot */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 w-24">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="fantasy-text text-sm">Armor</span>
            </div>
            <div 
              className="fantasy-slot w-16 h-16 flex items-center justify-center cursor-pointer"
              onClick={() => inventory.armor && handleUnequip('armor')}
            >
              {inventory.armor && (
                <div className="relative">
                  <img 
                    src={getItemSprite(inventory.armor)} 
                    alt={inventory.armor.name}
                    className="w-12 h-12 image-rendering-pixelated"
                    title={`${inventory.armor.name} (Defense: +${inventory.armor.defense})`}
                  />
                  <div className={`absolute -top-1 -right-1 text-xs ${getRarityColor(inventory.armor.rarity)}`}>
                    <Zap className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
            {inventory.armor && (
              <div className="fantasy-text text-sm font-bold">
                +{inventory.armor.defense} DEF
              </div>
            )}
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="space-y-4">
          <h4 className="fantasy-text text-lg font-bold">🎒 Items</h4>
          <div className="grid grid-cols-4 gap-3">
            {/* Actual inventory items */}
            {inventory.items.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="fantasy-slot w-16 h-16 flex items-center justify-center cursor-pointer"
                title={`${item.name} - Click to use`}
                onClick={() => handleItemClick(item, index)}
              >
                <div className="relative">
                  <img 
                    src={getItemSprite(item)} 
                    alt={item.name}
                    className="w-12 h-12 image-rendering-pixelated"
                  />
                  <div className={`absolute -top-1 -right-1 text-xs ${getRarityColor(item.rarity)}`}>
                    <Zap className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: Math.max(8 - inventory.items.length, 0) }, (_, index) => (
              <div key={`empty-${index}`} className="fantasy-slot w-16 h-16 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-dashed border-amber-600/30 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Stats Summary */}
        <div className="pt-4 border-t-2 border-amber-600">
          <div className="fantasy-text text-sm space-y-2">
            <div className="flex justify-between">
              <span>⚔️ Total Attack:</span>
              <span className="font-bold">{player.attack}</span>
            </div>
            <div className="flex justify-between">
              <span>🛡️ Total Defense:</span>
              <span className="font-bold">{player.defense}</span>
            </div>
            <div className="flex justify-between">
              <span>🎒 Items:</span>
              <span className="font-bold">{inventory.items.length}/8</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t-2 border-amber-600">
          <p className="fantasy-text text-xs">
            💡 Click consumables to use • Click weapons/armor to equip • Click equipment to unequip
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

