import React, { useState } from 'react';
import { Package, Coins, TrendingUp, AlertCircle } from 'lucide-react';

// Import item sprites
import ironSword from '../assets/sprites/items/iron_sword.png';
import royalSword from '../assets/sprites/items/royal_sword.png';
import enchantedBlade from '../assets/sprites/items/enchanted_blade.png';
import spikedMace from '../assets/sprites/items/spiked_mace.png';
import battleAxe from '../assets/sprites/items/battle_axe.png';
import crystalSpear from '../assets/sprites/items/crystal_spear.png';
import leatherArmor from '../assets/sprites/items/leather_armor.png';
import healthPotion from '../assets/sprites/items/health_potion.png';

const Shop = ({ inventory, player, onSellItem }) => {
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

  const getSellPrice = (item) => {
    // Sell for 60% of item value
    return Math.floor((item.value || 10) * 0.6);
  };

  const handleSellClick = (item, index) => {
    setSelectedItem({ item, index });
  };

  const confirmSell = () => {
    if (selectedItem) {
      onSellItem(selectedItem.item, selectedItem.index);
      setSelectedItem(null);
    }
  };

  const cancelSell = () => {
    setSelectedItem(null);
  };

  // Check if item is currently equipped
  const isEquipped = (item) => {
    return inventory.weapon?.id === item.id || inventory.armor?.id === item.id;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Shop Header */}
        <div className="fantasy-panel-enhanced rounded-xl p-6 mb-6">
          <h2 className="fantasy-title text-xl flex items-center gap-3 mb-4 pb-3 border-b-4 border-amber-700/50">
            <Coins className="w-6 h-6 text-yellow-400" />
            MERCHANT SHOP
          </h2>
          
          {/* Player Gold */}
          <div className="stat-display">
            <div className="stat-icon bg-gradient-to-br from-yellow-600 to-yellow-800 border-yellow-400">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span className="fantasy-text text-sm">Your Gold</span>
              <span className="fantasy-text text-2xl font-bold text-yellow-400">
                {player.gold}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-blue-900/30 border-l-4 border-blue-600 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="fantasy-text text-xs text-blue-300 leading-relaxed">
                Click any item to sell it for 60% of its value. Equipped items must be unequipped first.
              </p>
            </div>
          </div>
        </div>

        {/* Items for Sale */}
        <div className="fantasy-panel-enhanced rounded-xl p-6">
          <h4 className="fantasy-text font-bold text-amber-400 flex items-center gap-2 border-b-2 border-amber-700/50 pb-2 mb-4">
            <Package className="w-5 h-5" />
            YOUR ITEMS
          </h4>

          {inventory.items.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-3 text-amber-700 opacity-50" />
              <p className="fantasy-text text-sm opacity-50 italic">
                No items to sell
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {inventory.items.map((item, index) => {
                const sellPrice = getSellPrice(item);
                const equipped = isEquipped(item);
                
                return (
                  <div key={`${item.id}-${index}`} className="relative">
                    <div 
                      className={`inventory-slot-enhanced ${!equipped ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                      onClick={() => !equipped && handleSellClick(item, index)}
                      style={item.procedural && item.rarityColor ? {
                        borderColor: item.rarityColor,
                        boxShadow: `0 0 12px ${item.rarityColor}40`
                      } : {}}
                      title={equipped ? 'Unequip before selling' : `Click to sell for ${sellPrice} gold`}
                    >
                      <div className="relative">
                        <img 
                          src={getItemSprite(item)} 
                          alt={item.name}
                          className="w-14 h-14 pixel-perfect"
                        />
                        <div className={`absolute -top-2 -right-2 ${getRarityColor(item.rarity)}`}>
                          <TrendingUp className="w-4 h-4 drop-shadow-lg" style={
                            item.procedural && item.rarityColor ? {
                              color: item.rarityColor,
                              filter: `drop-shadow(0 0 4px ${item.rarityColor})`
                            } : {}
                          } />
                        </div>
                        {equipped && (
                          <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center rounded">
                            <span className="fantasy-text text-xs text-white font-bold">
                              EQUIPPED
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Sell Price */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-amber-600 rounded-full border-2 border-amber-800">
                      <span className="fantasy-text text-xs font-bold text-white flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {sellPrice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay-enhanced">
          <div className="fantasy-panel-enhanced rounded-2xl p-8 max-w-md mx-4 pixel-corners magical-glow">
            <h3 className="game-title text-xl mb-4 text-center">
              💰 SELL ITEM?
            </h3>
            
            {/* Item Display */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-amber-950/30 rounded-lg border-2 border-amber-700">
              <img 
                src={getItemSprite(selectedItem.item)} 
                alt={selectedItem.item.name}
                className="w-16 h-16 pixel-perfect"
              />
              <div className="flex-1">
                <h4 className={`fantasy-text font-bold ${getRarityColor(selectedItem.item.rarity)}`}>
                  {selectedItem.item.name}
                </h4>
                {selectedItem.item.description && (
                  <p className="fantasy-text text-xs text-gray-400 mt-1">
                    {selectedItem.item.description}
                  </p>
                )}
                {selectedItem.item.attack > 0 && (
                  <p className="fantasy-text text-xs text-red-400">
                    ⚔️ +{selectedItem.item.attack} ATK
                  </p>
                )}
                {selectedItem.item.defense > 0 && (
                  <p className="fantasy-text text-xs text-blue-400">
                    🛡️ +{selectedItem.item.defense} DEF
                  </p>
                )}
              </div>
            </div>

            {/* Sell Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/40 to-transparent border-l-4 border-yellow-500 rounded">
              <div className="flex items-center justify-between">
                <span className="fantasy-text text-sm">You will receive:</span>
                <span className="fantasy-text text-2xl font-bold text-yellow-400 flex items-center gap-2">
                  <Coins className="w-6 h-6" />
                  {getSellPrice(selectedItem.item)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelSell}
                className="pixel-btn flex-1 bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                CANCEL
              </button>
              <button
                onClick={confirmSell}
                className="pixel-btn flex-1 bg-gradient-to-b from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700"
              >
                SELL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

