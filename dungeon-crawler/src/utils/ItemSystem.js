// Item System for Dungeon Crawler
// Defines all available items with their stats and properties

export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  CONSUMABLE: 'consumable'
};

export const ITEM_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

// Weapon definitions
export const WEAPONS = {
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.COMMON,
    attack: 15,
    defense: 0,
    value: 50,
    sprite: 'iron_sword.png',
    description: 'A reliable iron sword'
  },
  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.UNCOMMON,
    attack: 22,
    defense: 0,
    value: 120,
    sprite: 'iron_sword.png', // Using same sprite for now
    description: 'A well-crafted steel sword'
  },
  enchanted_blade: {
    id: 'enchanted_blade',
    name: 'Enchanted Blade',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.RARE,
    attack: 30,
    defense: 0,
    value: 300,
    sprite: 'iron_sword.png',
    description: 'A blade imbued with magical power'
  },
  dragon_slayer: {
    id: 'dragon_slayer',
    name: 'Dragon Slayer',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.EPIC,
    attack: 45,
    defense: 0,
    value: 800,
    sprite: 'iron_sword.png',
    description: 'A legendary sword that has slain dragons'
  },
  ancient_sword: {
    id: 'ancient_sword',
    name: 'Ancient Sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.LEGENDARY,
    attack: 60,
    defense: 0,
    value: 1500,
    sprite: 'iron_sword.png',
    description: 'An ancient weapon of immense power'
  }
};

// Armor definitions
export const ARMOR = {
  leather_armor: {
    id: 'leather_armor',
    name: 'Leather Armor',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.COMMON,
    attack: 0,
    defense: 5,
    value: 40,
    sprite: 'leather_armor.png',
    description: 'Basic leather protection'
  },
  chain_mail: {
    id: 'chain_mail',
    name: 'Chain Mail',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.UNCOMMON,
    attack: 0,
    defense: 12,
    value: 150,
    sprite: 'leather_armor.png', // Using same sprite for now
    description: 'Flexible metal armor'
  },
  plate_armor: {
    id: 'plate_armor',
    name: 'Plate Armor',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.RARE,
    attack: 0,
    defense: 20,
    value: 400,
    sprite: 'leather_armor.png',
    description: 'Heavy but protective armor'
  },
  magic_robe: {
    id: 'magic_robe',
    name: 'Magic Robe',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.EPIC,
    attack: 0,
    defense: 25,
    value: 600,
    sprite: 'leather_armor.png',
    description: 'A robe woven with protective magic'
  },
  divine_armor: {
    id: 'divine_armor',
    name: 'Divine Armor',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.LEGENDARY,
    attack: 0,
    defense: 35,
    value: 1200,
    sprite: 'leather_armor.png',
    description: 'Armor blessed by the gods'
  }
};

// Consumable definitions
export const CONSUMABLES = {
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: ITEM_RARITY.COMMON,
    health: 50,
    value: 25,
    sprite: 'health_potion.png',
    description: 'Restores 50 health points'
  },
  greater_health_potion: {
    id: 'greater_health_potion',
    name: 'Greater Health Potion',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: ITEM_RARITY.UNCOMMON,
    health: 100,
    value: 60,
    sprite: 'health_potion.png',
    description: 'Restores 100 health points'
  },
  elixir_of_life: {
    id: 'elixir_of_life',
    name: 'Elixir of Life',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: ITEM_RARITY.RARE,
    health: 200,
    value: 150,
    sprite: 'health_potion.png',
    description: 'Fully restores health'
  }
};

// All items combined
export const ALL_ITEMS = {
  ...WEAPONS,
  ...ARMOR,
  ...CONSUMABLES
};

// Get item by ID
export const getItemById = (id) => {
  return ALL_ITEMS[id] || null;
};

// Get random item by type and rarity
export const getRandomItem = (type = null, rarity = null) => {
  let availableItems = Object.values(ALL_ITEMS);
  
  if (type) {
    availableItems = availableItems.filter(item => item.type === type);
  }
  
  if (rarity) {
    availableItems = availableItems.filter(item => item.rarity === rarity);
  }
  
  if (availableItems.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableItems.length);
  return availableItems[randomIndex];
};

// Get chest loot based on dungeon level
export const getChestLoot = (dungeonLevel) => {
  const loot = [];
  
  // Gold (always present)
  const goldAmount = Math.floor(Math.random() * (50 + dungeonLevel * 25)) + (25 + dungeonLevel * 10);
  loot.push({ type: 'gold', amount: goldAmount });
  
  // Determine item rarity based on dungeon level
  let rarityChance = Math.random();
  let itemRarity = ITEM_RARITY.COMMON;
  
  if (dungeonLevel >= 5 && rarityChance < 0.1) {
    itemRarity = ITEM_RARITY.LEGENDARY;
  } else if (dungeonLevel >= 4 && rarityChance < 0.2) {
    itemRarity = ITEM_RARITY.EPIC;
  } else if (dungeonLevel >= 3 && rarityChance < 0.4) {
    itemRarity = ITEM_RARITY.RARE;
  } else if (dungeonLevel >= 2 && rarityChance < 0.6) {
    itemRarity = ITEM_RARITY.UNCOMMON;
  }
  
  // 70% chance to get an item
  if (Math.random() < 0.7) {
    const itemType = Math.random() < 0.6 ? ITEM_TYPES.WEAPON : ITEM_TYPES.ARMOR;
    const item = getRandomItem(itemType, itemRarity);
    
    if (item) {
      loot.push({ type: 'item', item: item });
    }
  }
  
  // 30% chance to get a consumable
  if (Math.random() < 0.3) {
    const consumable = getRandomItem(ITEM_TYPES.CONSUMABLE);
    if (consumable) {
      loot.push({ type: 'item', item: consumable });
    }
  }
  
  return loot;
};

// Apply item stats to player
export const applyItemStats = (player, item) => {
  if (item.type === ITEM_TYPES.WEAPON) {
    player.attack += item.attack;
  } else if (item.type === ITEM_TYPES.ARMOR) {
    player.defense += item.defense;
  }
  return player;
};

// Remove item stats from player
export const removeItemStats = (player, item) => {
  if (item.type === ITEM_TYPES.WEAPON) {
    player.attack -= item.attack;
  } else if (item.type === ITEM_TYPES.ARMOR) {
    player.defense -= item.defense;
  }
  return player;
};
