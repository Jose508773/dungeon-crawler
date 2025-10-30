// Procedural Content Generation System
// Generates random weapons, enemy names, and dungeon themes

import { ITEM_TYPES, ITEM_RARITY } from './ItemSystem';

// ============================================
// DUNGEON THEMES
// ============================================

export const DUNGEON_THEMES = {
  STONE_DUNGEON: {
    id: 'stone_dungeon',
    name: 'Stone Dungeon',
    description: 'Ancient stone corridors filled with undead',
    colors: {
      floor: '#4a4a4a',
      wall: '#2a2a2a',
      accent: '#8b7355',
      fog: 'rgba(20, 20, 30, 0.3)'
    },
    enemies: ['skeleton', 'goblin', 'golem'],
    enemyPrefixes: ['Cursed', 'Ancient', 'Restless', 'Hollow'],
    lootMultiplier: 1.0,
    difficultyMultiplier: 1.0
  },
  ICE_CAVE: {
    id: 'ice_cave',
    name: 'Frozen Caverns',
    description: 'Icy caves inhabited by frost creatures',
    colors: {
      floor: '#c8e6ff',
      wall: '#88c0d0',
      accent: '#5e81ac',
      fog: 'rgba(200, 230, 255, 0.2)'
    },
    enemies: ['goblin', 'wraith', 'golem'],
    enemyPrefixes: ['Frozen', 'Icy', 'Frostbitten', 'Glacial', 'Arctic'],
    lootMultiplier: 1.2,
    difficultyMultiplier: 1.1,
    effectColor: '#88c0d0'
  },
  LAVA_PIT: {
    id: 'lava_pit',
    name: 'Molten Depths',
    description: 'Scorching tunnels near the earth\'s core',
    colors: {
      floor: '#8b0000',
      wall: '#2d0d0d',
      accent: '#ff4500',
      fog: 'rgba(255, 69, 0, 0.3)'
    },
    enemies: ['golem', 'wraith', 'dragon'],
    enemyPrefixes: ['Molten', 'Burning', 'Infernal', 'Charred', 'Volcanic'],
    lootMultiplier: 1.5,
    difficultyMultiplier: 1.3,
    effectColor: '#ff4500'
  },
  SHADOW_CRYPT: {
    id: 'shadow_crypt',
    name: 'Shadow Crypt',
    description: 'Dark crypts filled with malevolent spirits',
    colors: {
      floor: '#1a0033',
      wall: '#0d001a',
      accent: '#4a148c',
      fog: 'rgba(74, 20, 140, 0.4)'
    },
    enemies: ['wraith', 'skeleton', 'boss'],
    enemyPrefixes: ['Shadow', 'Corrupted', 'Void', 'Spectral', 'Ethereal'],
    lootMultiplier: 1.3,
    difficultyMultiplier: 1.2,
    effectColor: '#9c27b0'
  },
  CURSED_FOREST: {
    id: 'cursed_forest',
    name: 'Cursed Grove',
    description: 'A twisted forest where nature turned dark',
    colors: {
      floor: '#2d4a2d',
      wall: '#1a2a1a',
      accent: '#76ff03',
      fog: 'rgba(118, 255, 3, 0.2)'
    },
    enemies: ['goblin', 'wraith', 'golem'],
    enemyPrefixes: ['Twisted', 'Tainted', 'Blighted', 'Venomous', 'Wild'],
    lootMultiplier: 1.1,
    difficultyMultiplier: 1.15,
    effectColor: '#76ff03'
  }
};

// Select theme based on dungeon level
// Optional options: { unlockedBiomes: string[] }
export function selectDungeonTheme(level, options = {}) {
  const unlocked = Array.isArray(options.unlockedBiomes) ? options.unlockedBiomes : [];
  const allowFrost = unlocked.includes('frost');
  const allowCrypt = unlocked.includes('crypt');

  if (level <= 2) {
    return DUNGEON_THEMES.STONE_DUNGEON;
  } else if (level <= 4) {
    // Ice or Stone (Ice only if unlocked)
    if (allowFrost && Math.random() < 0.5) return DUNGEON_THEMES.ICE_CAVE;
    return DUNGEON_THEMES.STONE_DUNGEON;
  } else if (level <= 6) {
    // Ice, Stone, or Forest
    const choice = Math.random();
    if (choice < 0.33 && allowFrost) return DUNGEON_THEMES.ICE_CAVE;
    if (choice < 0.66) return DUNGEON_THEMES.CURSED_FOREST;
    return DUNGEON_THEMES.STONE_DUNGEON;
  } else if (level <= 8) {
    // Any except Stone
    const available = [
      ...(allowFrost ? [DUNGEON_THEMES.ICE_CAVE] : []),
      DUNGEON_THEMES.LAVA_PIT,
      DUNGEON_THEMES.CURSED_FOREST
    ];
    if (available.length === 0) available.push(DUNGEON_THEMES.CURSED_FOREST);
    return available[Math.floor(Math.random() * available.length)];
  } else {
    // End game: Lava or Shadow
    const endChoices = [DUNGEON_THEMES.LAVA_PIT];
    if (allowCrypt) endChoices.push(DUNGEON_THEMES.SHADOW_CRYPT);
    return endChoices[Math.floor(Math.random() * endChoices.length)];
  }
}

// ============================================
// ENEMY NAME GENERATOR
// ============================================

const ENEMY_NAME_COMPONENTS = {
  skeleton: {
    titles: ['', 'Captain', 'Knight', 'Lord', 'King', 'Champion'],
    names: ['Bones', 'Rattles', 'Grim', 'Gravelord', 'Marrow', 'Cadaver', 'Ossuary'],
    suffixes: ['', 'the Fallen', 'the Defiler', 'the Undying', 'the Cruel', 'the Eternal']
  },
  goblin: {
    titles: ['', 'Chief', 'Shaman', 'Warlord', 'Elder'],
    names: ['Grik', 'Snot', 'Grix', 'Zog', 'Brak', 'Snik', 'Grot', 'Mok'],
    suffixes: ['', 'the Vile', 'the Sneaky', 'the Quick', 'the Mad', 'Backstabber', 'Poisontongue']
  },
  golem: {
    titles: ['', 'Elder', 'Ancient', 'Titan', 'Prime'],
    names: ['Ironhide', 'Stonewall', 'Boulder', 'Granite', 'Obsidian', 'Basalt'],
    suffixes: ['', 'the Unbreakable', 'the Colossus', 'the Immovable', 'Guardian']
  },
  wraith: {
    titles: ['', 'Phantom', 'Specter', 'Spirit', 'Shade'],
    names: ['Whisper', 'Echo', 'Dusk', 'Gloom', 'Fade', 'Mist', 'Vapor'],
    suffixes: ['', 'of Sorrow', 'of Despair', 'of Dread', 'the Haunting', 'the Banshee']
  },
  boss: {
    titles: ['Lord', 'King', 'Overlord', 'Master', 'Emperor'],
    names: ['Darkness', 'Doom', 'Death', 'Terror', 'Nightmare', 'Oblivion'],
    suffixes: ['the Destroyer', 'the Devourer', 'the Merciless', 'the Eternal', 'the Immortal']
  },
  dragon: {
    titles: ['', 'Elder', 'Ancient', 'Wyrm', 'Great'],
    names: ['Infernus', 'Pyrothor', 'Scorchbane', 'Cinderfang', 'Emberclaw'],
    suffixes: ['', 'the Eternal', 'the Ancient', 'Worldburner', 'Flameheart', 'Ashbringer']
  }
};

export function generateEnemyName(enemyType, theme = null) {
  const components = ENEMY_NAME_COMPONENTS[enemyType] || ENEMY_NAME_COMPONENTS.skeleton;
  
  // Defensive checks for components
  if (!components || !components.titles || !components.names || !components.suffixes) {
    return enemyType ? `${enemyType} Enemy` : 'Enemy';
  }
  
  // Get random components with safe array access
  const title = components.titles[Math.floor(Math.random() * components.titles.length)] || '';
  const name = components.names[Math.floor(Math.random() * components.names.length)] || 'Unknown';
  const suffix = components.suffixes[Math.floor(Math.random() * components.suffixes.length)] || '';
  
  // Add theme prefix if available
  let prefix = '';
  if (theme && theme.enemyPrefixes && Array.isArray(theme.enemyPrefixes) && theme.enemyPrefixes.length > 0 && Math.random() < 0.4) {
    prefix = theme.enemyPrefixes[Math.floor(Math.random() * theme.enemyPrefixes.length)] + ' ';
  }
  
  // Construct name
  let fullName = prefix;
  if (title) fullName += title + ' ';
  fullName += name;
  if (suffix) fullName += ' ' + suffix;
  
  return fullName.trim() || 'Enemy';
}

// ============================================
// WEAPON GENERATOR
// ============================================

const WEAPON_PREFIXES = {
  [ITEM_RARITY.COMMON]: ['Rusty', 'Old', 'Worn', 'Simple', 'Basic', 'Iron'],
  [ITEM_RARITY.UNCOMMON]: ['Sharp', 'Sturdy', 'Fine', 'Steel', 'Silver', 'Forged'],
  [ITEM_RARITY.RARE]: ['Blessed', 'Tempered', 'Enchanted', 'Masterwork', 'Runic'],
  [ITEM_RARITY.EPIC]: ['Ancient', 'Legendary', 'Mythical', 'Celestial', 'Divine'],
  [ITEM_RARITY.LEGENDARY]: ['Godlike', 'Eternal', 'Cosmic', 'Primordial', 'Transcendent']
};

const WEAPON_TYPES = [
  'Sword', 'Axe', 'Mace', 'Dagger', 'Spear', 'Hammer', 
  'Blade', 'Cleaver', 'Scythe', 'Halberd', 'Glaive'
];

const WEAPON_SUFFIXES = {
  [ITEM_RARITY.COMMON]: ['', ''],
  [ITEM_RARITY.UNCOMMON]: ['of Power', 'of Strength', 'of Swiftness'],
  [ITEM_RARITY.RARE]: ['of the Bear', 'of the Lion', 'of the Phoenix', 'of Flames', 'of Ice'],
  [ITEM_RARITY.EPIC]: ['of the Gods', 'of Destruction', 'of Domination', 'of the Titan'],
  [ITEM_RARITY.LEGENDARY]: ['of Eternity', 'of the Cosmos', 'of Infinity', 'World Ender']
};

const RARITY_COLORS = {
  [ITEM_RARITY.COMMON]: '#9ca3af',
  [ITEM_RARITY.UNCOMMON]: '#10b981',
  [ITEM_RARITY.RARE]: '#3b82f6',
  [ITEM_RARITY.EPIC]: '#a855f7',
  [ITEM_RARITY.LEGENDARY]: '#f59e0b'
};

// Determine rarity based on level
export function determineRarity(dungeonLevel) {
  const rand = Math.random() * 100;
  const levelBonus = dungeonLevel * 2; // Higher levels = better chances
  
  // Legendary: 2% + 0.5% per level (max 10%)
  if (rand < Math.min(2 + levelBonus * 0.5, 10)) {
    return ITEM_RARITY.LEGENDARY;
  }
  // Epic: 8% + 1% per level (max 20%)
  if (rand < Math.min(10 + levelBonus, 30)) {
    return ITEM_RARITY.EPIC;
  }
  // Rare: 20% + 2% per level (max 40%)
  if (rand < Math.min(30 + levelBonus * 2, 70)) {
    return ITEM_RARITY.RARE;
  }
  // Uncommon: 30%
  if (rand < 70) {
    return ITEM_RARITY.UNCOMMON;
  }
  // Common: 40%
  return ITEM_RARITY.COMMON;
}

// Calculate stats based on rarity
function getRarityStatMultiplier(rarity) {
  switch (rarity) {
    case ITEM_RARITY.LEGENDARY: return 3.0;
    case ITEM_RARITY.EPIC: return 2.2;
    case ITEM_RARITY.RARE: return 1.6;
    case ITEM_RARITY.UNCOMMON: return 1.2;
    case ITEM_RARITY.COMMON:
    default: return 1.0;
  }
}

// Generate a random weapon
export function generateRandomWeapon(dungeonLevel, theme = null) {
  // Defensive check on dungeon level
  const safeLevel = Math.max(1, Math.min(20, dungeonLevel || 1));
  
  // Determine rarity
  const rarity = determineRarity(safeLevel);
  const multiplier = getRarityStatMultiplier(rarity);
  
  // Generate name with safe array access
  const prefixes = WEAPON_PREFIXES[rarity] || WEAPON_PREFIXES[ITEM_RARITY.COMMON];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const weaponType = WEAPON_TYPES[Math.floor(Math.random() * WEAPON_TYPES.length)];
  const suffixes = WEAPON_SUFFIXES[rarity] || WEAPON_SUFFIXES[ITEM_RARITY.COMMON];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // Add theme flavor
  let themeFlavor = '';
  if (theme && Math.random() < 0.3) {
    if (theme.id === 'ice_cave') themeFlavor = ' of Frost';
    if (theme.id === 'lava_pit') themeFlavor = ' of Flames';
    if (theme.id === 'shadow_crypt') themeFlavor = ' of Shadows';
    if (theme.id === 'cursed_forest') themeFlavor = ' of Thorns';
  }
  
  const name = `${prefix} ${weaponType}${suffix ? ' ' + suffix : ''}${themeFlavor}`;
  
  // Generate stats
  const baseAttack = 10 + (dungeonLevel * 3);
  const attackVariance = Math.floor(Math.random() * (dungeonLevel * 2)) - dungeonLevel;
  const attack = Math.max(5, Math.floor((baseAttack + attackVariance) * multiplier));
  
  const baseDefense = Math.floor(dungeonLevel * 0.5);
  const defense = Math.floor(baseDefense * multiplier * (Math.random() * 0.5 + 0.5));
  
  const baseValue = attack * 10 + defense * 15;
  const value = Math.floor(baseValue * multiplier);
  
  // Generate unique ID
  const id = `proc_weapon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Select sprite based on weapon type (cycle through available sprites)
  const spriteMap = {
    'Sword': 'royal_sword.png',
    'Blade': 'enchanted_blade.png',
    'Axe': 'battle_axe.png',
    'Mace': 'spiked_mace.png',
    'Spear': 'crystal_spear.png',
    'Dagger': 'iron_sword.png',
    'Hammer': 'spiked_mace.png',
    'Cleaver': 'battle_axe.png',
    'Scythe': 'crystal_spear.png',
    'Halberd': 'crystal_spear.png',
    'Glaive': 'enchanted_blade.png'
  };
  
  const sprite = spriteMap[weaponType] || 'iron_sword.png';
  
  return {
    id,
    name,
    type: ITEM_TYPES.WEAPON,
    rarity,
    attack,
    defense,
    value,
    sprite,
    description: `A ${rarity} ${weaponType.toLowerCase()} found in ${theme?.name || 'the dungeon'}`,
    procedural: true,
    rarityColor: RARITY_COLORS[rarity],
    dungeonLevel,
    theme: theme?.id || null
  };
}

// Generate multiple random weapons
export function generateWeaponLoot(dungeonLevel, count = 1, theme = null) {
  const weapons = [];
  for (let i = 0; i < count; i++) {
    weapons.push(generateRandomWeapon(dungeonLevel, theme));
  }
  return weapons;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get theme appropriate enemies for spawning
export function getThemeEnemies(theme) {
  return theme.enemies;
}

// Apply theme multipliers to enemy stats
export function applyThemeMultipliers(enemyStats, theme) {
  // Defensive checks
  if (!enemyStats || typeof enemyStats !== 'object') {
    console.warn('Invalid enemy stats provided to applyThemeMultipliers');
    return {
      health: 10,
      attack: 5,
      defense: 1,
      gold: 5,
      experience: 10
    };
  }
  
  if (!theme || typeof theme !== 'object') {
    console.warn('Invalid theme provided to applyThemeMultipliers');
    return enemyStats;
  }
  
  const difficultyMult = theme.difficultyMultiplier || 1.0;
  const lootMult = theme.lootMultiplier || 1.0;
  
  return {
    ...enemyStats,
    health: Math.floor((enemyStats.health || 10) * difficultyMult),
    attack: Math.floor((enemyStats.attack || 5) * difficultyMult),
    defense: Math.floor((enemyStats.defense || 1) * difficultyMult),
    gold: Math.floor((enemyStats.gold || 5) * lootMult),
    experience: Math.floor((enemyStats.experience || 10) * lootMult)
  };
}

// Seed-based random number generator for consistent procedural generation
export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  
  random() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  
  randomInt(min, max) {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
  
  randomChoice(array) {
    return array[this.randomInt(0, array.length - 1)];
  }
}

export default {
  DUNGEON_THEMES,
  selectDungeonTheme,
  generateEnemyName,
  generateRandomWeapon,
  generateWeaponLoot,
  determineRarity,
  getThemeEnemies,
  applyThemeMultipliers,
  SeededRandom
};

