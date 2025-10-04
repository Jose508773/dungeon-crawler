// Skills & Abilities System for Dungeon Crawler

export const SKILL_BRANCHES = {
  COMBAT: 'combat',
  DEFENSE: 'defense',
  MAGIC: 'magic'
};

export const SKILL_TYPES = {
  ACTIVE: 'active',
  PASSIVE: 'passive'
};

// Skill definitions
export const SKILLS = {
  // COMBAT BRANCH - Active Skills
  power_strike: {
    id: 'power_strike',
    name: 'Power Strike',
    branch: SKILL_BRANCHES.COMBAT,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 3,
    description: 'Deal massive damage to a single enemy',
    cooldown: 3,
    effect: (level) => ({
      damageMultiplier: 1.5 + (level * 0.5), // 2x at level 1, 2.5x at level 2, 3x at level 3
      message: 'Power Strike!'
    }),
    cost: (level) => level, // 1 SP for level 1, 2 SP for level 2, etc.
    icon: '⚔️'
  },
  whirlwind: {
    id: 'whirlwind',
    name: 'Whirlwind Attack',
    branch: SKILL_BRANCHES.COMBAT,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 3,
    description: 'Attack all adjacent enemies',
    cooldown: 4,
    effect: (level) => ({
      aoeRadius: 1,
      damageMultiplier: 0.6 + (level * 0.2), // 80% at level 1, 100% at level 2, 120% at level 3
      message: 'Whirlwind Attack!'
    }),
    requirements: { power_strike: 1 },
    cost: (level) => level + 1,
    icon: '🌪️'
  },
  execute: {
    id: 'execute',
    name: 'Execute',
    branch: SKILL_BRANCHES.COMBAT,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 2,
    description: 'Deal extra damage to low-health enemies',
    cooldown: 5,
    effect: (level) => ({
      damageMultiplier: 1.5 + (level * 0.5),
      executeThreshold: 0.3 + (level * 0.1), // 30% HP at level 1, 40% HP at level 2
      bonusMultiplier: 2, // Triple damage if below threshold
      message: 'Execute!'
    }),
    requirements: { whirlwind: 1 },
    cost: (level) => level + 2,
    icon: '💀'
  },

  // COMBAT BRANCH - Passive Skills
  critical_mastery: {
    id: 'critical_mastery',
    name: 'Critical Mastery',
    branch: SKILL_BRANCHES.COMBAT,
    type: SKILL_TYPES.PASSIVE,
    maxLevel: 3,
    description: 'Increase critical hit chance and damage',
    effect: (level) => ({
      critChanceBonus: level * 0.05, // +5% per level
      critDamageBonus: level * 0.2, // +20% crit damage per level
    }),
    cost: (level) => level,
    icon: '🎯'
  },
  bloodlust: {
    id: 'bloodlust',
    name: 'Bloodlust',
    branch: SKILL_BRANCHES.COMBAT,
    type: SKILL_TYPES.PASSIVE,
    maxLevel: 2,
    description: 'Lifesteal - heal for a percentage of damage dealt',
    effect: (level) => ({
      lifestealPercent: level * 0.1, // 10% per level
    }),
    requirements: { critical_mastery: 2 },
    cost: (level) => level + 1,
    icon: '🩸'
  },

  // DEFENSE BRANCH - Active Skills
  shield_block: {
    id: 'shield_block',
    name: 'Shield Block',
    branch: SKILL_BRANCHES.DEFENSE,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 3,
    description: 'Reduce incoming damage for one turn',
    cooldown: 3,
    effect: (level) => ({
      damageReduction: 0.4 + (level * 0.1), // 50% at level 1, 60% at level 2, 70% at level 3
      duration: 1,
      message: 'Shield Block activated!'
    }),
    cost: (level) => level,
    icon: '🛡️'
  },
  fortify: {
    id: 'fortify',
    name: 'Fortify',
    branch: SKILL_BRANCHES.DEFENSE,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 2,
    description: 'Gain temporary defense boost',
    cooldown: 4,
    effect: (level) => ({
      defenseBonus: 5 + (level * 5), // +10 defense at level 1, +15 at level 2
      duration: 3,
      message: 'Fortify!'
    }),
    requirements: { shield_block: 1 },
    cost: (level) => level + 1,
    icon: '⛰️'
  },

  // DEFENSE BRANCH - Passive Skills
  iron_skin: {
    id: 'iron_skin',
    name: 'Iron Skin',
    branch: SKILL_BRANCHES.DEFENSE,
    type: SKILL_TYPES.PASSIVE,
    maxLevel: 3,
    description: 'Permanently increase defense',
    effect: (level) => ({
      defenseBonus: level * 3, // +3 defense per level
    }),
    cost: (level) => level,
    icon: '🛡️'
  },
  damage_reduction: {
    id: 'damage_reduction',
    name: 'Damage Reduction',
    branch: SKILL_BRANCHES.DEFENSE,
    type: SKILL_TYPES.PASSIVE,
    maxLevel: 3,
    description: 'Reduce all incoming damage',
    effect: (level) => ({
      damageReductionPercent: level * 0.05, // 5% per level
    }),
    requirements: { iron_skin: 2 },
    cost: (level) => level + 1,
    icon: '💎'
  },
  last_stand: {
    id: 'last_stand',
    name: 'Last Stand',
    branch: SKILL_BRANCHES.DEFENSE,
    type: SKILL_TYPES.PASSIVE,
    maxLevel: 1,
    description: 'Survive with 1 HP once per floor when taking lethal damage',
    effect: () => ({
      procChance: 1.0, // 100% chance (doesn't scale with level)
    }),
    requirements: { damage_reduction: 2 },
    cost: () => 3, // Fixed cost
    icon: '💪'
  },

  // MAGIC BRANCH - Active Skills
  heal: {
    id: 'heal',
    name: 'Heal',
    branch: SKILL_BRANCHES.MAGIC,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 3,
    description: 'Restore health',
    cooldown: 5,
    effect: (level) => ({
      healPercent: 0.2 + (level * 0.1), // 30% at level 1, 40% at level 2, 50% at level 3
      message: 'Heal!'
    }),
    cost: (level) => level,
    icon: '💚'
  },
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    branch: SKILL_BRANCHES.MAGIC,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 3,
    description: 'Cast a fireball dealing magical damage',
    cooldown: 3,
    effect: (level) => ({
      damageMultiplier: 1.0 + (level * 0.3),
      ignoreDefense: true,
      message: 'Fireball!'
    }),
    requirements: { heal: 1 },
    cost: (level) => level + 1,
    icon: '🔥'
  },
  chain_lightning: {
    id: 'chain_lightning',
    name: 'Chain Lightning',
    branch: SKILL_BRANCHES.MAGIC,
    type: SKILL_TYPES.ACTIVE,
    maxLevel: 2,
    description: 'Deal damage to multiple enemies',
    cooldown: 6,
    effect: (level) => ({
      damageMultiplier: 0.8 + (level * 0.2),
      maxTargets: 2 + level, // 3 targets at level 1, 4 at level 2
      ignoreDefense: true,
      message: 'Chain Lightning!'
    }),
    requirements: { fireball: 2 },
    cost: (level) => level + 2,
    icon: '⚡'
  },

  // MAGIC BRANCH - Passive Skills
  mana_shield: {
    id: 'mana_shield',
    name: 'Mana Shield',
    branch: SKILL_BRANCHES.MAGIC,
    type: SKILL_TYPES.PASSIVE,
    maxLevel: 3,
    description: 'Gain bonus max health',
    effect: (level) => ({
      maxHealthBonus: level * 15, // +15 HP per level
    }),
    cost: (level) => level,
    icon: '🔮'
  },
  regeneration: {
    id: 'regeneration',
    name: 'Regeneration',
    branch: SKILL_BRANCHES.MAGIC,
    type: SKILL_TYPES.PASSIVE,
    maxLevel: 3,
    description: 'Restore health each turn',
    effect: (level) => ({
      healthPerTurn: level * 2, // 2 HP per turn per level
    }),
    requirements: { mana_shield: 1 },
    cost: (level) => level + 1,
    icon: '💫'
  }
};

// Skill System Manager
export class SkillSystem {
  /**
   * Apply all passive skill effects to a player
   * @param {Object} player - The player object
   * @param {Object} learnedSkills - Object mapping skill IDs to levels
   * @returns {Object} Modified player object with passive bonuses applied
   */
  static applyPassiveSkills(player, learnedSkills) {
    if (!player || !learnedSkills) {
      console.error('Invalid player or learnedSkills passed to applyPassiveSkills');
      return player;
    }

    let modifiedPlayer = { ...player };

    Object.entries(learnedSkills).forEach(([skillId, level]) => {
      // Skip if no levels learned
      if (!level || level === 0) return;
      
      const skill = SKILLS[skillId];
      if (!skill) {
        console.warn(`Unknown skill in learned skills: ${skillId}`);
        return;
      }
      
      // Only apply passive skills
      if (skill.type !== SKILL_TYPES.PASSIVE) return;

      // Ensure level doesn't exceed max
      const effectiveLevel = Math.min(level, skill.maxLevel);
      const effect = skill.effect(effectiveLevel);

      // Apply passive effects with safety checks
      if (effect.defenseBonus && typeof effect.defenseBonus === 'number') {
        modifiedPlayer.defense = (modifiedPlayer.defense || 0) + effect.defenseBonus;
      }
      if (effect.maxHealthBonus && typeof effect.maxHealthBonus === 'number') {
        modifiedPlayer.maxHealth = (modifiedPlayer.maxHealth || 100) + effect.maxHealthBonus;
      }
      if (effect.critChanceBonus && typeof effect.critChanceBonus === 'number') {
        modifiedPlayer.critChance = (modifiedPlayer.critChance || 0.1) + effect.critChanceBonus;
        // Cap crit chance at 100%
        modifiedPlayer.critChance = Math.min(1.0, modifiedPlayer.critChance);
      }
      if (effect.critDamageBonus && typeof effect.critDamageBonus === 'number') {
        modifiedPlayer.critDamage = (modifiedPlayer.critDamage || 1.8) + effect.critDamageBonus;
      }
      if (effect.damageReductionPercent && typeof effect.damageReductionPercent === 'number') {
        modifiedPlayer.damageReduction = (modifiedPlayer.damageReduction || 0) + effect.damageReductionPercent;
        // Cap damage reduction at 90%
        modifiedPlayer.damageReduction = Math.min(0.9, modifiedPlayer.damageReduction);
      }
      if (effect.lifestealPercent && typeof effect.lifestealPercent === 'number') {
        modifiedPlayer.lifesteal = (modifiedPlayer.lifesteal || 0) + effect.lifestealPercent;
        // Cap lifesteal at 100%
        modifiedPlayer.lifesteal = Math.min(1.0, modifiedPlayer.lifesteal);
      }
      if (effect.healthPerTurn && typeof effect.healthPerTurn === 'number') {
        modifiedPlayer.regeneration = (modifiedPlayer.regeneration || 0) + effect.healthPerTurn;
      }
    });

    return modifiedPlayer;
  }

  /**
   * Activate an active skill and return its effects
   * @param {string} skillId - The skill ID to activate
   * @param {number} level - The level of the skill
   * @param {Object} player - The player object
   * @param {Array} targets - Array of target enemies (optional)
   * @returns {Object} Result object with success status and skill effects
   */
  static activateSkill(skillId, level, player, targets = []) {
    // Validation
    if (!skillId || !player) {
      console.error('Invalid parameters for activateSkill');
      return { success: false, message: 'Invalid skill parameters' };
    }

    const skill = SKILLS[skillId];
    if (!skill) {
      console.error(`Unknown skill: ${skillId}`);
      return { success: false, message: 'Unknown skill' };
    }

    if (skill.type !== SKILL_TYPES.ACTIVE) {
      console.warn(`Attempted to activate passive skill: ${skillId}`);
      return { success: false, message: 'Cannot activate passive skill' };
    }

    // Ensure level is valid
    const effectiveLevel = Math.max(1, Math.min(level, skill.maxLevel));
    const effect = skill.effect(effectiveLevel);
    
    const result = {
      success: true,
      message: effect.message,
      effect,
      skillName: skill.name,
      cooldown: skill.cooldown
    };

    // Apply active skill effects based on skill ID
    switch (skillId) {
      case 'heal': {
        const healAmount = Math.floor(player.maxHealth * effect.healPercent);
        result.healAmount = healAmount;
        result.newHealth = Math.min(player.maxHealth, player.health + healAmount);
        break;
      }

      case 'shield_block': {
        result.applyBuff = {
          type: 'shield_block',
          damageReduction: effect.damageReduction,
          duration: effect.duration
        };
        break;
      }

      case 'fortify': {
        result.applyBuff = {
          type: 'fortify',
          defenseBonus: effect.defenseBonus,
          duration: effect.duration
        };
        break;
      }

      case 'power_strike':
      case 'fireball':
      case 'execute': {
        result.damageMultiplier = effect.damageMultiplier;
        result.ignoreDefense = effect.ignoreDefense || false;
        if (skillId === 'execute' && targets && targets[0]) {
          const enemy = targets[0];
          const healthPercent = enemy.health / enemy.maxHealth;
          if (healthPercent <= effect.executeThreshold) {
            result.damageMultiplier *= effect.bonusMultiplier;
            result.message += ' EXECUTE!';
          }
        }
        break;
      }

      case 'whirlwind': {
        result.isAOE = true;
        result.damageMultiplier = effect.damageMultiplier;
        break;
      }

      case 'chain_lightning': {
        result.isChainLightning = true;
        result.damageMultiplier = effect.damageMultiplier;
        result.maxTargets = effect.maxTargets;
        result.ignoreDefense = effect.ignoreDefense;
        break;
      }

      default: {
        console.warn(`Unknown skill activation: ${skillId}`);
        return { success: false, message: 'Unknown skill effect' };
      }
    }

    return result;
  }

  /**
   * Check if a skill can be learned based on level and requirements
   * @param {string} skillId - The skill ID to check
   * @param {Object} currentSkills - Object mapping skill IDs to current levels
   * @returns {boolean} True if skill can be learned
   */
  static canLearnSkill(skillId, currentSkills) {
    const skill = SKILLS[skillId];
    if (!skill) return false;

    const currentLevel = currentSkills[skillId] || 0;
    
    // Check if already at max level
    if (currentLevel >= skill.maxLevel) return false;

    // Check requirements
    if (skill.requirements) {
      for (const [reqSkillId, reqLevel] of Object.entries(skill.requirements)) {
        const hasReqLevel = (currentSkills[reqSkillId] || 0) >= reqLevel;
        if (!hasReqLevel) return false;
      }
    }

    return true;
  }

  /**
   * Get the skill point cost to learn the next level
   * @param {string} skillId - The skill ID
   * @param {number} currentLevel - Current level of the skill
   * @returns {number} Cost in skill points (999 if invalid)
   */
  static getSkillCost(skillId, currentLevel) {
    const skill = SKILLS[skillId];
    if (!skill) {
      console.error(`Unknown skill: ${skillId}`);
      return 999;
    }
    // Cost function takes the NEXT level we want to learn
    const nextLevel = currentLevel + 1;
    if (nextLevel > skill.maxLevel) {
      return 999; // Can't level up beyond max
    }
    return skill.cost(nextLevel);
  }

  /**
   * Get all skills for a specific branch
   * @param {string} branch - The skill branch (combat, defense, magic)
   * @returns {Array} Array of skill objects
   */
  static getSkillsByBranch(branch) {
    return Object.values(SKILLS).filter(skill => skill.branch === branch);
  }

  /**
   * Apply regeneration healing to player
   * @param {Object} player - The player object
   * @param {Object} learnedSkills - Object mapping skill IDs to levels
   * @returns {number} New health value after regeneration
   */
  static applyRegeneration(player, learnedSkills) {
    if (!player || !learnedSkills) {
      console.error('Invalid parameters for applyRegeneration');
      return player?.health || 0;
    }

    const regenSkillLevel = learnedSkills.regeneration || 0;
    if (regenSkillLevel === 0) return player.health;

    // Validate regeneration skill exists
    if (!SKILLS.regeneration) {
      console.error('Regeneration skill not found');
      return player.health;
    }

    const effectiveLevel = Math.min(regenSkillLevel, SKILLS.regeneration.maxLevel);
    const regenEffect = SKILLS.regeneration.effect(effectiveLevel);
    const healAmount = regenEffect.healthPerTurn || 0;
    const newHealth = Math.min(player.maxHealth || 100, (player.health || 0) + healAmount);
    
    return Math.max(0, newHealth); // Ensure health doesn't go negative
  }

  /**
   * Check if Last Stand passive can trigger
   * @param {Object} player - The player object
   * @param {Object} learnedSkills - Object mapping skill IDs to levels
   * @param {number} dungeonLevel - Current dungeon level
   * @returns {boolean} True if Last Stand can trigger
   */
  static checkLastStand(player, learnedSkills, dungeonLevel) {
    if (!player || !learnedSkills || typeof dungeonLevel !== 'number') {
      console.error('Invalid parameters for checkLastStand');
      return false;
    }

    const hasLastStand = (learnedSkills.last_stand || 0) > 0;
    const lastStandUsedThisFloor = player.lastStandUsedOnFloor === dungeonLevel;
    
    return hasLastStand && !lastStandUsedThisFloor;
  }
}

export default SkillSystem;

