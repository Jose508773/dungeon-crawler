import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Sword, Shield, Zap, Coins, X, TrendingUp } from 'lucide-react';

// Import item sprites
import ironSword from '../assets/sprites/items/iron_sword.png';
import royalSword from '../assets/sprites/items/royal_sword.png';
import enchantedBlade from '../assets/sprites/items/enchanted_blade.png';
import spikedMace from '../assets/sprites/items/spiked_mace.png';
import battleAxe from '../assets/sprites/items/battle_axe.png';
import crystalSpear from '../assets/sprites/items/crystal_spear.png';
import leatherArmor from '../assets/sprites/items/leather_armor.png';
import healthPotion from '../assets/sprites/items/health_potion.png';

const Inventory = ({ inventory, player, onUseItem, onUnequipItem, onEquipItem, onSellItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);

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
    // Open item details modal instead of auto-equipping/using
    setSelectedItem({ item, index });
  };

  const handleUseItemAction = () => {
    if (selectedItem && onUseItem) {
      onUseItem(selectedItem.item, selectedItem.index);
      setSelectedItem(null);
    }
  };

  const handleEquipItemAction = () => {
    if (selectedItem && onEquipItem) {
      onEquipItem(selectedItem.item, selectedItem.index);
      setSelectedItem(null);
    }
  };

  const handleSellItemAction = () => {
    if (selectedItem && onSellItem) {
      onSellItem(selectedItem.item, selectedItem.index);
      setSelectedItem(null);
    }
  };

  const handleUnequip = (itemType) => {
    if (onUnequipItem) {
      onUnequipItem(itemType);
    }
  };

  const getSellPrice = (item) => {
    return Math.floor((item.value || 10) * 0.6);
  };

  const isItemEquipped = (item) => {
    return inventory.weapon?.id === item.id || inventory.armor?.id === item.id;
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
                title={`${item.name}${item.procedural ? ' [Procedural]' : ''}\n${item.description || ''}\n\nClick to ${item.type === 'consumable' ? 'use' : 'equip'}`}
                onClick={() => handleItemClick(item, index)}
                style={item.procedural && item.rarityColor ? {
                  borderColor: item.rarityColor,
                  boxShadow: `0 0 12px ${item.rarityColor}40`
                } : {}}
              >
                <div className="relative">
                  <img 
                    src={getItemSprite(item)} 
                    alt={item.name}
                    className="w-14 h-14 pixel-perfect"
                  />
                  <div className={`absolute -top-2 -right-2 ${getRarityColor(item.rarity)}`}>
                    <Zap className="w-4 h-4 drop-shadow-lg" style={
                      item.procedural && item.rarityColor ? {
                        color: item.rarityColor,
                        filter: `drop-shadow(0 0 4px ${item.rarityColor})`
                      } : {}
                    } />
                  </div>
                  {/* Procedural item indicator */}
                  {item.procedural && (
                    <div 
                      className="absolute -bottom-1 -left-1 w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: item.rarityColor,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                      title="Procedurally Generated"
                    />
                  )}
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
            💡 Click items to view details • Click equipped items to unequip
          </p>
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay-enhanced">
          <div className="fantasy-panel-enhanced rounded-2xl p-8 max-w-lg mx-4 pixel-corners magical-glow">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 pixel-btn p-2"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Item Display */}
            <div className="flex items-start gap-6 mb-6">
              <div className="relative flex-shrink-0">
                <img 
                  src={getItemSprite(selectedItem.item)} 
                  alt={selectedItem.item.name}
                  className="w-24 h-24 pixel-perfect"
                  style={selectedItem.item.procedural && selectedItem.item.rarityColor ? {
                    filter: `drop-shadow(0 0 12px ${selectedItem.item.rarityColor})`
                  } : {}}
                />
                {isItemEquipped(selectedItem.item) && (
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    EQUIPPED
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`fantasy-title text-2xl mb-2 ${getRarityColor(selectedItem.item.rarity)}`}>
                  {selectedItem.item.name}
                </h3>
                {selectedItem.item.procedural && (
                  <div className="mb-2">
                    <span className="fantasy-text text-xs px-2 py-1 bg-purple-900/50 border border-purple-600 rounded">
                      ✨ Procedural
                    </span>
                  </div>
                )}
                <p className="fantasy-text text-sm text-gray-300 mb-4">
                  {selectedItem.item.description || 'A mysterious item from the dungeon.'}
                </p>
              </div>
            </div>

            {/* Item Stats */}
            <div className="space-y-3 mb-6">
              {selectedItem.item.attack > 0 && (
                <div className="stat-display p-3 bg-gradient-to-r from-red-900/40 to-transparent border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <span className="fantasy-text text-sm">⚔️ Attack Power</span>
                    <span className="fantasy-text text-xl font-bold text-red-400">
                      +{selectedItem.item.attack}
                    </span>
                  </div>
                </div>
              )}
              {selectedItem.item.defense > 0 && (
                <div className="stat-display p-3 bg-gradient-to-r from-blue-900/40 to-transparent border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <span className="fantasy-text text-sm">🛡️ Defense</span>
                    <span className="fantasy-text text-xl font-bold text-blue-400">
                      +{selectedItem.item.defense}
                    </span>
                  </div>
                </div>
              )}
              {selectedItem.item.health && (
                <div className="stat-display p-3 bg-gradient-to-r from-green-900/40 to-transparent border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <span className="fantasy-text text-sm">❤️ Restores Health</span>
                    <span className="fantasy-text text-xl font-bold text-green-400">
                      +{selectedItem.item.health} HP
                    </span>
                  </div>
                </div>
              )}
              <div className="stat-display p-3 bg-gradient-to-r from-yellow-900/40 to-transparent border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <span className="fantasy-text text-sm">💰 Value</span>
                  <span className="fantasy-text text-lg font-bold text-yellow-400">
                    {selectedItem.item.value || 10} gold
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Use/Equip Button */}
              {selectedItem.item.type === 'consumable' && (
                <button
                  onClick={handleUseItemAction}
                  className="pixel-btn w-full bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  USE ITEM
                </button>
              )}
              {(selectedItem.item.type === 'weapon' || selectedItem.item.type === 'armor') && !isItemEquipped(selectedItem.item) && (
                <button
                  onClick={handleEquipItemAction}
                  className="pixel-btn w-full bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 flex items-center justify-center gap-2"
                >
                  <Sword className="w-5 h-5" />
                  EQUIP
                </button>
              )}

              {/* Sell Button */}
              {!isItemEquipped(selectedItem.item) && onSellItem && (
                <button
                  onClick={handleSellItemAction}
                  className="pixel-btn w-full bg-gradient-to-b from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  SELL FOR {getSellPrice(selectedItem.item)} GOLD
                </button>
              )}
              {isItemEquipped(selectedItem.item) && (
                <div className="p-3 bg-amber-900/30 border border-amber-700 rounded text-center">
                  <p className="fantasy-text text-xs text-amber-400">
                    ⚠️ Unequip this item before selling
                  </p>
                </div>
              )}

              {/* Cancel Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="pixel-btn w-full bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

