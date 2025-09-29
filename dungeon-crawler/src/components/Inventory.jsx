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
    <div className="h-full flex flex-col">
      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Equipment Slots */}
        <div className="space-y-5">
          <h4 className="fantasy-text font-bold text-amber-400 flex items-center gap-2 border-b-2 border-amber-700/50 pb-2">
            <Sword className="w-5 h-5" />
            EQUIPMENT
          </h4>
          
          {/* Weapon Slot */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 min-w-[6rem]">
              <Sword className="w-5 h-5 text-amber-400" />
              <span className="fantasy-text text-xs">Weapon</span>
            </div>
            <div 
              className="inventory-slot-enhanced"
              onClick={() => inventory.weapon && handleUnequip('weapon')}
              title={inventory.weapon ? 'Click to unequip' : 'Empty weapon slot'}
            >
              {inventory.weapon ? (
                <div className="relative">
                  <img 
                    src={getItemSprite(inventory.weapon)} 
                    alt={inventory.weapon.name}
                    className="w-14 h-14 pixel-perfect"
                    title={`${inventory.weapon.name} (Attack: +${inventory.weapon.attack})`}
                  />
                  <div className={`absolute -top-2 -right-2 ${getRarityColor(inventory.weapon.rarity)}`}>
                    <Zap className="w-4 h-4 drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 border-2 border-dashed border-amber-700/40 rounded flex items-center justify-center">
                  <Sword className="w-8 h-8 text-amber-700/30" />
                </div>
              )}
            </div>
            {inventory.weapon && (
              <div className="fantasy-text text-sm font-bold px-3 py-1 bg-red-900/30 rounded border border-red-700">
                +{inventory.weapon.attack} ATK
              </div>
            )}
          </div>
          
          {/* Armor Slot */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 min-w-[6rem]">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="fantasy-text text-xs">Armor</span>
            </div>
            <div 
              className="inventory-slot-enhanced"
              onClick={() => inventory.armor && handleUnequip('armor')}
              title={inventory.armor ? 'Click to unequip' : 'Empty armor slot'}
            >
              {inventory.armor ? (
                <div className="relative">
                  <img 
                    src={getItemSprite(inventory.armor)} 
                    alt={inventory.armor.name}
                    className="w-14 h-14 pixel-perfect"
                    title={`${inventory.armor.name} (Defense: +${inventory.armor.defense})`}
                  />
                  <div className={`absolute -top-2 -right-2 ${getRarityColor(inventory.armor.rarity)}`}>
                    <Zap className="w-4 h-4 drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 border-2 border-dashed border-amber-700/40 rounded flex items-center justify-center">
                  <Shield className="w-8 h-8 text-amber-700/30" />
                </div>
              )}
            </div>
            {inventory.armor && (
              <div className="fantasy-text text-sm font-bold px-3 py-1 bg-blue-900/30 rounded border border-blue-700">
                +{inventory.armor.defense} DEF
              </div>
            )}
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="space-y-5">
          <h4 className="fantasy-text font-bold text-amber-400 flex items-center gap-2 border-b-2 border-amber-700/50 pb-2">
            <Package className="w-5 h-5" />
            ITEMS
          </h4>
          <div className="grid grid-cols-5 gap-4">
            {/* Actual inventory items */}
            {inventory.items.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="inventory-slot-enhanced"
                title={`${item.name} - Click to ${item.type === 'consumable' ? 'use' : 'equip'}`}
                onClick={() => handleItemClick(item, index)}
              >
                <div className="relative">
                  <img 
                    src={getItemSprite(item)} 
                    alt={item.name}
                    className="w-14 h-14 pixel-perfect"
                  />
                  <div className={`absolute -top-2 -right-2 ${getRarityColor(item.rarity)}`}>
                    <Zap className="w-4 h-4 drop-shadow-lg" />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: Math.max(10 - inventory.items.length, 0) }, (_, index) => (
              <div key={`empty-${index}`} className="inventory-slot-enhanced cursor-default" style={{ opacity: 0.5 }}>
                <div className="w-14 h-14 border-2 border-dashed border-amber-700/30 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Player Stats Summary */}
        <div className="pt-6 border-t-4 border-amber-700/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-display flex-col items-start">
              <div className="fantasy-text text-xs text-amber-400 mb-1">⚔️ ATTACK</div>
              <div className="fantasy-text text-lg font-bold">{player.attack}</div>
            </div>
            <div className="stat-display flex-col items-start">
              <div className="fantasy-text text-xs text-amber-400 mb-1">🛡️ DEFENSE</div>
              <div className="fantasy-text text-lg font-bold">{player.defense}</div>
            </div>
            <div className="stat-display flex-col items-start">
              <div className="fantasy-text text-xs text-amber-400 mb-1">🎒 CAPACITY</div>
              <div className="fantasy-text text-lg font-bold">{inventory.items.length}/10</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t-2 border-amber-700/30">
          <p className="fantasy-text text-xs leading-relaxed text-center opacity-80">
            💡 Click items to use/equip • Click equipped items to unequip
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

