// Skill System for Dungeon Crawler
// Defines all player skills and abilities

export const SKILL_BRANCHES = {
  COMBAT: 'combat',
  DEFENSE: 'defense',
  MAGIC: 'magic',
  SUPPORT: 'support',
  ULTIMATE: 'ultimate'
};

export const SKILL_TYPES = {
  // Type categories
  ACTIVE: 'active',
  PASSIVE: 'passive',
  ULTIMATE: 'ultimate',
  
  // Active combat skills
  POWER_STRIKE: 'power_strike',
  CLEAVE: 'cleave',
  CHARGE_ATTACK: 'charge_attack',
  DEFENSIVE_STANCE: 'defensive_stance',
  WHIRLWIND: 'whirlwind',
  FIREBALL: 'fireball',
  ICE_SHARD: 'ice_shard',
  LIGHTNING_BOLT: 'lightning_bolt',
  HEAL: 'heal',
  SHIELD_BASH: 'shield_bash',
  
  // Passive abilities
  COUNTERATTACK: 'counterattack',
  RIPOSTE: 'riposte',
  EVASION: 'evasion',
  PARRY: 'parry',
  BERSERKER_RAGE: 'berserker_rage',
  IRON_SKIN: 'iron_skin',
  QUICK_STRIKE: 'quick_strike',
  BLOODTHIRST: 'bloodthirst',
  
  // Ultimate abilities
  DRAGON_SLAYER: 'dragon_slayer',
  PHOENIX_RISING: 'phoenix_rising',
  VOID_STRIKE: 'void_strike',
  TIME_STOP: 'time_stop',
  OMNISLASH: 'omnislash'
};

export const SKILLS = {
  [SKILL_TYPES.POWER_STRIKE]: {
    id: SKILL_TYPES.POWER_STRIKE,
    name: 'Power Strike',
    type: 'active',
    category: 'combat',
    branch: SKILL_BRANCHES.COMBAT,
    level: 1,
    cost: 0,
    cooldown: 0,
    damageMultiplier: 1.5,
    description: 'A powerful attack that deals 150% damage',
    icon: '⚔️',
    color: '#dc2626',
    requirements: { level: 1 }
  },
  
  [SKILL_TYPES.CLEAVE]: {
    id: SKILL_TYPES.CLEAVE,
    name: 'Cleave',
    type: 'active',
    category: 'combat',
    branch: SKILL_BRANCHES.COMBAT,
    level: 1,
    cost: 0,
    cooldown: 2,
    damageMultiplier: 1.2,
    areaOfEffect: true,
    description: 'Strikes all adjacent enemies for 120% damage',
    icon: '🗡️',
    color: '#dc2626',
    requirements: { level: 3 }
  },
  
  [SKILL_TYPES.CHARGE_ATTACK]: {
    id: SKILL_TYPES.CHARGE_ATTACK,
    name: 'Charge Attack',
    type: 'active',
    category: 'combat',
    branch: SKILL_BRANCHES.COMBAT,
    level: 1,
    cost: 0,
    cooldown: 3,
    damageMultiplier: 2.0,
    description: 'Charges forward and attacks for 200% damage',
    icon: '💨',
    color: '#dc2626',
    requirements: { level: 5 }
  },
  
  [SKILL_TYPES.DEFENSIVE_STANCE]: {
    id: SKILL_TYPES.DEFENSIVE_STANCE,
    name: 'Defensive Stance',
    type: 'active',
    category: 'defense',
    branch: SKILL_BRANCHES.DEFENSE,
    level: 1,
    cost: 0,
    cooldown: 4,
    duration: 3,
    damageReduction: 0.5,
    description: 'Reduces incoming damage by 50% for 3 turns',
    icon: '🛡️',
    color: '#2563eb',
    requirements: { level: 2 }
  },
  
  [SKILL_TYPES.WHIRLWIND]: {
    id: SKILL_TYPES.WHIRLWIND,
    name: 'Whirlwind',
    type: 'active',
    category: 'combat',
    branch: SKILL_BRANCHES.COMBAT,
    level: 1,
    cost: 0,
    cooldown: 5,
    damageMultiplier: 1.3,
    areaOfEffect: true,
    description: 'Spins around dealing 130% damage to all enemies',
    icon: '🌪️',
    color: '#dc2626',
    requirements: { level: 7 }
  },
  
  [SKILL_TYPES.FIREBALL]: {
    id: SKILL_TYPES.FIREBALL,
    name: 'Fireball',
    type: 'active',
    category: 'magic',
    branch: SKILL_BRANCHES.MAGIC,
    level: 1,
    cost: 0,
    cooldown: 3,
    damageMultiplier: 1.8,
    elemental: 'fire',
    description: 'Launches a fireball dealing 180% fire damage',
    icon: '🔥',
    color: '#f97316',
    requirements: { level: 4 }
  },
  
  [SKILL_TYPES.ICE_SHARD]: {
    id: SKILL_TYPES.ICE_SHARD,
    name: 'Ice Shard',
    type: 'active',
    category: 'magic',
    branch: SKILL_BRANCHES.MAGIC,
    level: 1,
    cost: 0,
    cooldown: 2,
    damageMultiplier: 1.4,
    elemental: 'ice',
    statusEffect: 'frozen',
    statusDuration: 2,
    description: 'Fires an ice shard dealing 140% damage and freezing the target',
    icon: '❄️',
    color: '#3b82f6',
    requirements: { level: 6 }
  },
  
  [SKILL_TYPES.LIGHTNING_BOLT]: {
    id: SKILL_TYPES.LIGHTNING_BOLT,
    name: 'Lightning Bolt',
    type: 'active',
    category: 'magic',
    branch: SKILL_BRANCHES.MAGIC,
    level: 1,
    cost: 0,
    cooldown: 4,
    damageMultiplier: 2.2,
    elemental: 'lightning',
    description: 'Strikes with lightning dealing 220% damage',
    icon: '⚡',
    color: '#fbbf24',
    requirements: { level: 8 }
  },
  
  [SKILL_TYPES.HEAL]: {
    id: SKILL_TYPES.HEAL,
    name: 'Heal',
    type: 'active',
    category: 'support',
    branch: SKILL_BRANCHES.SUPPORT,
    level: 1,
    cost: 0,
    cooldown: 4,
    healing: 50,
    description: 'Restores 50 HP',
    icon: '✨',
    color: '#10b981',
    requirements: { level: 3 }
  },
  
  [SKILL_TYPES.SHIELD_BASH]: {
    id: SKILL_TYPES.SHIELD_BASH,
    name: 'Shield Bash',
    type: 'active',
    category: 'combat',
    branch: SKILL_BRANCHES.DEFENSE,
    level: 1,
    cost: 0,
    cooldown: 3,
    damageMultiplier: 1.1,
    statusEffect: 'stun',
    statusDuration: 1,
    description: 'Bashes with shield dealing 110% damage and stunning the target',
    icon: '🛡️',
    color: '#2563eb',
    requirements: { level: 4 }
  },
  
  [SKILL_TYPES.COUNTERATTACK]: {
    id: SKILL_TYPES.COUNTERATTACK,
    name: 'Counterattack',
    type: 'passive',
    category: 'defense',
    branch: SKILL_BRANCHES.DEFENSE,
    level: 1,
    description: 'Automatically counterattacks when taking damage',
    icon: '🔄',
    color: '#7c3aed',
    requirements: { level: 5 }
  },
  
  [SKILL_TYPES.RIPOSTE]: {
    id: SKILL_TYPES.RIPOSTE,
    name: 'Riposte',
    type: 'passive',
    category: 'defense',
    branch: SKILL_BRANCHES.DEFENSE,
    level: 1,
    description: 'Chance to counterattack with increased damage',
    icon: '⚔️',
    color: '#7c3aed',
    requirements: { level: 7 }
  },
  
  [SKILL_TYPES.EVASION]: {
    id: SKILL_TYPES.EVASION,
    name: 'Evasion',
    type: 'passive',
    category: 'defense',
    branch: SKILL_BRANCHES.DEFENSE,
    level: 1,
    description: 'Chance to dodge incoming attacks',
    icon: '💨',
    color: '#7c3aed',
    requirements: { level: 6 }
  },
  
  [SKILL_TYPES.PARRY]: {
    id: SKILL_TYPES.PARRY,
    name: 'Parry',
    type: 'passive',
    category: 'defense',
    branch: SKILL_BRANCHES.DEFENSE,
    level: 1,
    description: 'Chance to parry attacks and reduce damage',
    icon: '⚔️',
    color: '#7c3aed',
    requirements: { level: 8 }
  },
  
  [SKILL_TYPES.BERSERKER_RAGE]: {
    id: SKILL_TYPES.BERSERKER_RAGE,
    name: 'Berserker Rage',
    type: 'passive',
    category: 'offense',
    branch: SKILL_BRANCHES.COMBAT,
    level: 1,
    description: 'Increases damage when health is low',
    icon: '😡',
    color: '#dc2626',
    requirements: { level: 9 }
  },
  
  [SKILL_TYPES.IRON_SKIN]: {
    id: SKILL_TYPES.IRON_SKIN,
    name: 'Iron Skin',
    type: 'passive',
    category: 'defense',
    branch: SKILL_BRANCHES.DEFENSE,
    level: 1,
    description: 'Reduces all incoming damage',
    icon: '🛡️',
    color: '#6b7280',
    requirements: { level: 10 }
  },
  
  [SKILL_TYPES.QUICK_STRIKE]: {
    id: SKILL_TYPES.QUICK_STRIKE,
    name: 'Quick Strike',
    type: 'passive',
    category: 'offense',
    branch: SKILL_BRANCHES.COMBAT,
    level: 1,
    description: 'Chance to attack twice in one turn',
    icon: '⚡',
    color: '#fbbf24',
    requirements: { level: 11 }
  },
  
  [SKILL_TYPES.BLOODTHIRST]: {
    id: SKILL_TYPES.BLOODTHIRST,
    name: 'Bloodthirst',
    type: 'passive',
    category: 'offense',
    branch: SKILL_BRANCHES.COMBAT,
    level: 1,
    description: 'Heals when dealing damage',
    icon: '🩸',
    color: '#ef4444',
    requirements: { level: 12 }
  },
  
  [SKILL_TYPES.DRAGON_SLAYER]: {
    id: SKILL_TYPES.DRAGON_SLAYER,
    name: 'Dragon Slayer',
    type: 'ultimate',
    category: 'combat',
    branch: SKILL_BRANCHES.ULTIMATE,
    level: 1,
    cost: 0,
    cooldown: 10,
    damageMultiplier: 3.0,
    description: 'Ultimate attack dealing 300% damage to dragons',
    icon: '🐉',
    color: '#dc2626',
    requirements: { level: 15, skillPoints: 3 }
  },
  
  [SKILL_TYPES.PHOENIX_RISING]: {
    id: SKILL_TYPES.PHOENIX_RISING,
    name: 'Phoenix Rising',
    type: 'ultimate',
    category: 'support',
    branch: SKILL_BRANCHES.ULTIMATE,
    level: 1,
    cost: 0,
    cooldown: 15,
    healing: 100,
    statusEffect: 'regeneration',
    statusDuration: 5,
    description: 'Fully heals and grants regeneration for 5 turns',
    icon: '🔥',
    color: '#f97316',
    requirements: { level: 18, skillPoints: 3 }
  },
  
  [SKILL_TYPES.VOID_STRIKE]: {
    id: SKILL_TYPES.VOID_STRIKE,
    name: 'Void Strike',
    type: 'ultimate',
    category: 'magic',
    branch: SKILL_BRANCHES.ULTIMATE,
    level: 1,
    cost: 0,
    cooldown: 12,
    damageMultiplier: 2.5,
      ignoreDefense: true,
    description: 'Strikes through all defenses dealing 250% damage',
    icon: '🌌',
    color: '#7c3aed',
    requirements: { level: 20, skillPoints: 3 }
  },
  
  [SKILL_TYPES.TIME_STOP]: {
    id: SKILL_TYPES.TIME_STOP,
    name: 'Time Stop',
    type: 'ultimate',
    category: 'magic',
    branch: SKILL_BRANCHES.ULTIMATE,
    level: 1,
    cost: 0,
    cooldown: 20,
    duration: 2,
    description: 'Stops time for 2 turns, allowing extra actions',
    icon: '⏰',
    color: '#3b82f6',
    requirements: { level: 25, skillPoints: 5 }
  },
  
  [SKILL_TYPES.OMNISLASH]: {
    id: SKILL_TYPES.OMNISLASH,
    name: 'Omnislash',
    type: 'ultimate',
    category: 'combat',
    branch: SKILL_BRANCHES.ULTIMATE,
    level: 1,
    cost: 0,
    cooldown: 15,
    damageMultiplier: 4.0,
    areaOfEffect: true,
    description: 'Attacks all enemies for 400% damage',
    icon: '⚔️',
    color: '#dc2626',
    requirements: { level: 30, skillPoints: 5 }
  }
};

export class SkillSystem {
  constructor() {
    this.learnedSkills = new Set();
    this.skillCooldowns = new Map();
    this.skillLevels = new Map();
  }

  // Static method to get skills by branch
  static getSkillsByBranch(branch) {
    return Object.values(SKILLS).filter(skill => skill.branch === branch);
  }

  // Static method to get skill cost
  static getSkillCost(skillId, currentLevel) {
    const skill = SKILLS[skillId];
    if (!skill) return 0;
    
    // Base cost is 1 skill point, increases with level
    return 1 + currentLevel;
  }

  // Static method to apply passive skills to player stats
  static applyPassiveSkills(player, learnedSkills) {
    // Create a copy of the player to modify
    const updatedPlayer = { ...player };
    
    // Initialize base stats if they don't exist
    // Base stats = total stats - item bonuses - passive bonuses
    if (!updatedPlayer.baseAttack) {
      updatedPlayer.baseAttack = updatedPlayer.attack || 10;
    }
    if (!updatedPlayer.baseDefense) {
      updatedPlayer.baseDefense = updatedPlayer.defense || 0;
    }
    
    // Reset passive bonuses (we'll recalculate them)
    updatedPlayer.passiveBonuses = {
      attack: 0,
      defense: 0,
      maxHealth: 0,
      evasion: 0,
      critChance: 0
    };
    
    // Apply passive skill bonuses based on learned skills
    for (const [skillId, level] of Object.entries(learnedSkills)) {
      if (!level || level === 0) continue;
      
      const skill = SKILLS[skillId];
      if (!skill || skill.type !== 'passive') continue;
      
      // Apply bonuses based on skill level (scales with level)
      switch (skillId) {
        case SKILL_TYPES.IRON_SKIN:
          // Increases defense - +2 defense per level
          updatedPlayer.passiveBonuses.defense += level * 2;
          break;
        
        case SKILL_TYPES.BERSERKER_RAGE:
          // Increases attack when health is low (tracked as flag)
          updatedPlayer.hasBerserkerRage = true;
          updatedPlayer.passiveBonuses.attack += level * 1; // Base bonus
          break;
        
        case SKILL_TYPES.EVASION:
          // Increases evasion chance - +5% per level
          updatedPlayer.passiveBonuses.evasion += level * 5;
          break;
        
        case SKILL_TYPES.QUICK_STRIKE:
          // Chance to attack twice (tracked as flag)
          updatedPlayer.hasQuickStrike = true;
          updatedPlayer.passiveBonuses.critChance += level * 3; // Small crit bonus
          break;
        
        case SKILL_TYPES.BLOODTHIRST:
          // Heals on damage (tracked as flag)
          updatedPlayer.hasBloodthirst = true;
          break;
        
        case SKILL_TYPES.COUNTERATTACK:
          // Auto counterattacks (tracked as flag)
          updatedPlayer.hasCounterattack = true;
          break;
        
        case SKILL_TYPES.RIPOSTE:
          // Enhanced counterattack (tracked as flag)
          updatedPlayer.hasRiposte = true;
          updatedPlayer.passiveBonuses.attack += level * 1;
          break;
        
        case SKILL_TYPES.PARRY:
          // Parry chance (tracked as flag)
          updatedPlayer.hasParry = true;
          updatedPlayer.passiveBonuses.defense += level * 1;
          break;
        
        default:
          break;
      }
    }
    
    // Calculate total stats: baseAttack + passiveBonuses + itemBonuses
    // Item bonuses are already included in the current attack/defense
    // So we need to extract them first
    const currentAttack = updatedPlayer.attack || updatedPlayer.baseAttack || 10;
    const currentDefense = updatedPlayer.defense || updatedPlayer.baseDefense || 0;
    
    // Calculate item bonuses (difference between current and base before passive)
    const itemBonuses = {
      attack: currentAttack - updatedPlayer.baseAttack,
      defense: currentDefense - updatedPlayer.baseDefense
    };
    
    // Apply all bonuses: baseAttack + itemBonuses + passiveBonuses
    updatedPlayer.attack = updatedPlayer.baseAttack + itemBonuses.attack + updatedPlayer.passiveBonuses.attack;
    updatedPlayer.defense = updatedPlayer.baseDefense + itemBonuses.defense + updatedPlayer.passiveBonuses.defense;
    
    return updatedPlayer;
  }

  // Regeneration tick helper used by Game loop
  // Restores health by player's regeneration stat each turn
  static applyRegeneration(player, learnedSkills) {
    const regenAmount = Math.max(0, Math.floor(player.regeneration || 0));
    if (regenAmount <= 0) return player.health;
    const newHealth = Math.min(player.maxHealth || 0, (player.health || 0) + regenAmount);
    return newHealth;
  }

  // Static method to check if a skill can be learned
  static canLearnSkill(skillId, learnedSkills) {
    const skill = SKILLS[skillId];
    if (!skill) return false;
    
    // Check if already at max level (5)
    const currentLevel = learnedSkills[skillId] || 0;
    if (currentLevel >= 5) return false;
    
    // Check requirements
    if (skill.requirements) {
      // For now, we'll assume requirements are checked elsewhere
      // This method just checks if the skill can be upgraded
      return true;
    }
    
    return true;
  }

  // Learn a new skill
  learnSkill(skillType) {
    const skill = SKILLS[skillType];
    if (!skill) return false;

    // Check requirements
    if (!this.checkRequirements(skill)) return false;

    this.learnedSkills.add(skillType);
    this.skillLevels.set(skillType, 1);
    return true;
  }

  // Check if skill requirements are met
  checkRequirements(skill) {
    const requirements = skill.requirements;
    if (!requirements) return true;

    // This would need to be passed from the game state
    // For now, just check if it's a valid skill
    return true;
  }

  // Check if skill is learned
  isSkillLearned(skillType) {
    return this.learnedSkills.has(skillType);
  }

  // Get skill level
  getSkillLevel(skillType) {
    return this.skillLevels.get(skillType) || 0;
  }

  // Upgrade a skill
  upgradeSkill(skillType) {
    if (!this.isSkillLearned(skillType)) return false;
    
    const currentLevel = this.getSkillLevel(skillType);
    const maxLevel = 5; // Maximum skill level
    
    if (currentLevel >= maxLevel) return false;
    
    this.skillLevels.set(skillType, currentLevel + 1);
    return true;
  }

  // Use a skill
  useSkill(skillType, caster, target = null) {
    const skill = SKILLS[skillType];
    if (!skill || !this.isSkillLearned(skillType)) return null;

    // Check cooldown
    if (this.isOnCooldown(skillType)) return null;

    // Set cooldown
    this.skillCooldowns.set(skillType, skill.cooldown);

    // Return skill data for processing
    return {
      type: skillType,
      name: skill.name,
      damageMultiplier: skill.damageMultiplier,
      healing: skill.healing,
      statusEffect: skill.statusEffect,
      statusDuration: skill.statusDuration,
      areaOfEffect: skill.areaOfEffect,
      ignoreDefense: skill.ignoreDefense,
      elemental: skill.elemental,
      duration: skill.duration,
      damageReduction: skill.damageReduction,
      target: target // Include target for skill processing
    };
  }

  // Check if skill is on cooldown
  isOnCooldown(skillType) {
    const cooldown = this.skillCooldowns.get(skillType);
    return cooldown > 0;
  }

  // Reduce cooldowns
  reduceCooldowns() {
    for (const [skillType, cooldown] of this.skillCooldowns) {
      if (cooldown > 0) {
        this.skillCooldowns.set(skillType, cooldown - 1);
      }
    }
  }

  // Get available skills
  getAvailableSkills() {
    return Array.from(this.learnedSkills).map(skillType => ({
      type: skillType,
      ...SKILLS[skillType],
      level: this.getSkillLevel(skillType),
      onCooldown: this.isOnCooldown(skillType)
    }));
  }

  // Get skill cooldown
  getSkillCooldown(skillType) {
    return this.skillCooldowns.get(skillType) || 0;
  }

  // Get all skills by category
  getSkillsByCategory(category) {
    return Object.values(SKILLS).filter(skill => skill.category === category);
  }

  // Get learnable skills
  getLearnableSkills(playerLevel, skillPoints) {
    return Object.entries(SKILLS).filter(([skillType, skill]) => {
      if (this.isSkillLearned(skillType)) return false;
      
      const requirements = skill.requirements;
      if (!requirements) return true;
      
      return playerLevel >= (requirements.level || 0) && 
             skillPoints >= (requirements.skillPoints || 0);
    });
  }
}

// Utility functions for skills
export const SkillUtils = {
  // Apply skill effects
  applySkillEffects(skill, caster, target, combatSystem) {
    const effects = [];

    // Apply damage
    if (skill.damageMultiplier) {
      const damage = Math.floor((caster.attack || 10) * skill.damageMultiplier);
      if (target) {
        const actualDamage = target.takeDamage ? target.takeDamage(damage) : damage;
        effects.push({
          type: 'damage',
          damage: actualDamage,
          target: target.name || 'Unknown',
          skill: skill.name
        });
      }
    }

    // Apply healing
    if (skill.healing) {
      const healing = skill.healing;
      caster.health = Math.min(caster.maxHealth, caster.health + healing);
      effects.push({
        type: 'healing',
        healing: healing,
        target: caster.name || 'Unknown',
        skill: skill.name
      });
    }

    // Apply status effects
    if (skill.statusEffect && skill.statusDuration) {
      if (target && combatSystem.applyStatusEffect) {
        combatSystem.applyStatusEffect(target, skill.statusEffect, skill.statusDuration);
        effects.push({
          type: 'status_effect',
          effect: skill.statusEffect,
          duration: skill.statusDuration,
          target: target.name || 'Unknown',
          skill: skill.name
        });
      }
    }

    return effects;
  },

  // Get skill description
  getSkillDescription(skillType) {
    const skill = SKILLS[skillType];
    if (!skill) return 'Unknown skill';
    
    let description = skill.description;
    if (skill.cooldown > 0) {
      description += ` (Cooldown: ${skill.cooldown} turns)`;
    }
    if (skill.cost > 0) {
      description += ` (Cost: ${skill.cost} MP)`;
    }
    
    return description;
  }
};