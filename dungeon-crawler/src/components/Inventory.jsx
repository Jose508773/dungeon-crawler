import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Sword, Shield, Zap } from 'lucide-react';

// Import item sprites
import ironSword from '../assets/sprites/items/iron_sword.png';
import leatherArmor from '../assets/sprites/items/leather_armor.png';
import healthPotion from '../assets/sprites/items/health_potion.png';
import inventorySlot from '../assets/sprites/ui/inventory_slot.png';

const Inventory = ({ inventory, player, onUseItem, onUnequipItem }) => {
  const slotStyle = {
    width: '48px',
    height: '48px',
    backgroundImage: `url(${inventorySlot})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    imageRendering: 'pixelated',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #4a5568',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const itemStyle = {
    width: '40px',
    height: '40px',
    imageRendering: 'pixelated'
  };

  const getItemSprite = (item) => {
    if (item.sprite === 'iron_sword.png') return ironSword;
    if (item.sprite === 'leather_armor.png') return leatherArmor;
    if (item.sprite === 'health_potion.png') return healthPotion;
    // Fallback to iron sword for now
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
    }
  };

  const handleUnequip = (itemType) => {
    if (onUnequipItem) {
      onUnequipItem(itemType);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Equipment Slots */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Equipment</h4>
          
          {/* Weapon Slot */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-20">
              <Sword className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Weapon</span>
            </div>
            <div 
              style={slotStyle} 
              onClick={() => inventory.weapon && handleUnequip('weapon')}
              className={inventory.weapon ? 'hover:border-orange-400' : ''}
            >
              {inventory.weapon && (
                <div className="relative">
                  <img 
                    src={getItemSprite(inventory.weapon)} 
                    alt={inventory.weapon.name}
                    style={itemStyle}
                    title={`${inventory.weapon.name} (Attack: +${inventory.weapon.attack})`}
                  />
                  <div className={`absolute -top-1 -right-1 text-xs ${getRarityColor(inventory.weapon.rarity)}`}>
                    <Zap className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
            {inventory.weapon && (
              <div className="text-xs text-gray-400">
                +{inventory.weapon.attack} ATK
              </div>
            )}
          </div>
          
          {/* Armor Slot */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-20">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Armor</span>
            </div>
            <div 
              style={slotStyle}
              onClick={() => inventory.armor && handleUnequip('armor')}
              className={inventory.armor ? 'hover:border-orange-400' : ''}
            >
              {inventory.armor && (
                <div className="relative">
                  <img 
                    src={getItemSprite(inventory.armor)} 
                    alt={inventory.armor.name}
                    style={itemStyle}
                    title={`${inventory.armor.name} (Defense: +${inventory.armor.defense})`}
                  />
                  <div className={`absolute -top-1 -right-1 text-xs ${getRarityColor(inventory.armor.rarity)}`}>
                    <Zap className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
            {inventory.armor && (
              <div className="text-xs text-gray-400">
                +{inventory.armor.defense} DEF
              </div>
            )}
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Items</h4>
          <div className="grid grid-cols-4 gap-2">
            {/* Actual inventory items */}
            {inventory.items.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                style={slotStyle} 
                title={`${item.name} - Click to use`}
                onClick={() => handleItemClick(item, index)}
                className="hover:border-orange-400 cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={getItemSprite(item)} 
                    alt={item.name}
                    style={itemStyle}
                  />
                  <div className={`absolute -top-1 -right-1 text-xs ${getRarityColor(item.rarity)}`}>
                    <Zap className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: Math.max(8 - inventory.items.length, 0) }, (_, index) => (
              <div key={`empty-${index}`} style={slotStyle} />
            ))}
          </div>
        </div>

        {/* Player Stats Summary */}
        <div className="pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 space-y-1">
            <div>Total Attack: {player.attack}</div>
            <div>Total Defense: {player.defense}</div>
            <div>Items: {inventory.items.length}/8</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Click items to use • Click equipment to unequip
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;

