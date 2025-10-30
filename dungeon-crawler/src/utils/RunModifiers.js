// Per-run build diversity system: generate random modifiers that change playstyle

const MODIFIERS = [
  {
    id: 'glass_cannon',
    name: 'Glass Cannon',
    description: '+50% attack, -25% max health',
    apply: (player) => {
      const newMaxHealth = Math.max(1, Math.round(player.maxHealth * 0.75));
      return {
        ...player,
        attack: Math.round(player.attack * 1.5),
        maxHealth: newMaxHealth,
        health: Math.min(newMaxHealth, Math.max(1, Math.round(player.health * 0.75)))
      };
    }
  },
  {
    id: 'bulwark',
    name: 'Bulwark',
    description: '+30% defense, -15% attack',
    apply: (player) => ({
      ...player,
      defense: Math.round(player.defense * 1.3),
      attack: Math.max(1, Math.round(player.attack * 0.85))
    })
  },
  {
    id: 'vampiric',
    name: 'Vampiric',
    description: '+6% lifesteal',
    apply: (player) => ({
      ...player,
      lifesteal: (player.lifesteal || 0) + 0.06
    })
  },
  {
    id: 'assassin',
    name: 'Assassin',
    description: '+10% crit chance, +20% crit damage, -10% defense',
    apply: (player) => ({
      ...player,
      critChance: (player.critChance || 0) + 0.10,
      critDamage: (player.critDamage || 1.5) + 0.2,
      defense: Math.max(0, Math.round(player.defense * 0.9))
    })
  },
  {
    id: 'regenerator',
    name: 'Regenerator',
    description: 'Regenerate +2 HP per turn',
    apply: (player) => ({
      ...player,
      regeneration: (player.regeneration || 0) + 2
    })
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: '+2 starting skill points',
    apply: (player) => ({
      ...player,
      skillPoints: (player.skillPoints || 0) + 2
    })
  }
];

export function rollRunModifiers(count = 2) {
  const picks = [];
  const available = [...MODIFIERS];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    picks.push(available.splice(idx, 1)[0]);
  }
  return picks;
}

export function applyRunModifiers(player, modifiers) {
  return modifiers.reduce((acc, m) => (m && m.apply ? m.apply(acc) : acc), player);
}

export function getAllModifiers() {
  return MODIFIERS;
}


