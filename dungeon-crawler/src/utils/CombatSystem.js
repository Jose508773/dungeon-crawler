// Combat System for turn-based battles

export class CombatSystem {
  static calculateDamage(attacker, defender, skillModifier = null) {
    // Base damage with some randomness
    const baseDamage = attacker.attack || 10;
    const variance = Math.floor(baseDamage * 0.3);
    const randomDamage = baseDamage + Math.floor(Math.random() * variance) - Math.floor(variance / 2);
    
    // Apply skill damage multiplier if present
    let modifiedDamage = randomDamage;
    if (skillModifier && skillModifier.damageMultiplier) {
      modifiedDamage = Math.floor(randomDamage * skillModifier.damageMultiplier);
    }
    
    // Crit chance (base 10% + any bonuses)
    const critChance = attacker.critChance || 0.1;
    const isCrit = Math.random() < critChance;
    const critMultiplier = attacker.critDamage || 1.8;
    const critDamage = isCrit ? Math.floor(modifiedDamage * critMultiplier) : modifiedDamage;
    
    // Apply defense (unless skill ignores it)
    const ignoreDefense = skillModifier && skillModifier.ignoreDefense;
    const defense = ignoreDefense ? 0 : (defender.defense || 0);
    
    // Apply damage reduction if defender has it
    let finalDamage = Math.max(1, critDamage - defense);
    if (defender.damageReduction) {
      finalDamage = Math.floor(finalDamage * (1 - defender.damageReduction));
    }
    
    return { damage: Math.max(1, finalDamage), isCrit };
  }

  static playerAttackEnemy(player, enemy, skillModifier = null) {
    // Defensive checks
    if (!player || !enemy) {
      console.error('Invalid player or enemy in playerAttackEnemy');
      return { damage: 0, enemyDefeated: false, message: 'Attack failed!', isCrit: false, lifestealHealing: 0 };
    }
    
    // Ensure enemy has takeDamage method
    if (typeof enemy.takeDamage !== 'function') {
      console.error('Enemy missing takeDamage method!', enemy);
      // Fallback: manually apply damage
      enemy.health = Math.max(0, (enemy.health || 0) - (player.attack || 10));
      enemy.isAlive = enemy.health > 0;
    }
    
    const { damage, isCrit } = this.calculateDamage(player, enemy, skillModifier);
    const actualDamage = typeof enemy.takeDamage === 'function' 
      ? enemy.takeDamage(damage) 
      : Math.min(damage, enemy.health || 0);
    
    // Apply lifesteal if player has it
    let lifestealHealing = 0;
    if (player.lifesteal && player.lifesteal > 0) {
      lifestealHealing = Math.floor(actualDamage * player.lifesteal);
      player.health = Math.min(player.maxHealth || 100, (player.health || 0) + lifestealHealing);
    }
    
    const result = {
      damage: actualDamage,
      enemyDefeated: !(enemy.isAlive ?? (enemy.health > 0)),
      message: `You deal ${actualDamage} damage to ${enemy.name || 'enemy'}!`,
      isCrit,
      lifestealHealing
    };

    if (lifestealHealing > 0) {
      result.message += ` (Lifesteal: +${lifestealHealing} HP)`;
    }

    if (enemy.isAlive ?? (enemy.health > 0)) {
      result.message += ` ${enemy.name || 'Enemy'} has ${enemy.health || 0}/${enemy.maxHealth || 1} HP remaining.`;
    } else {
      result.message += ` ${enemy.name || 'Enemy'} is defeated!`;
      result.experience = enemy.experience || 0;
      result.gold = enemy.gold || 0;
    }

    return result;
  }

  static enemyAttackPlayer(enemy, player, playerBuffs = {}) {
    // Defensive checks
    if (!enemy || !player) {
      console.error('Invalid enemy or player in enemyAttackPlayer');
      return { damage: 0, playerDefeated: false, message: 'Enemy attack failed!', isCrit: false, lastStandTriggered: false };
    }
    
    const { damage, isCrit } = this.calculateDamage(enemy, player);
    let actualDamage = damage;
    let blockedAmount = 0;
    
    // Apply shield block buff if active
    if (playerBuffs && playerBuffs.shield_block) {
      blockedAmount = Math.floor(damage * (playerBuffs.shield_block.damageReduction || 0));
      actualDamage = Math.floor(actualDamage * (1 - (playerBuffs.shield_block.damageReduction || 0)));
    }
    
    actualDamage = Math.min(actualDamage, player.health || 0);
    player.health = Math.max(0, (player.health || 0) - actualDamage);
    
    const result = {
      damage: actualDamage,
      playerDefeated: player.health <= 0,
      message: `${enemy.name} deals ${actualDamage} damage to you!`,
      isCrit,
      lastStandTriggered: false
    };
    
    if (blockedAmount > 0) {
      result.message += ` (Blocked: ${blockedAmount} damage)`;
    }

    // Check for Last Stand (player survives with 1 HP)
    if (player.health <= 0 && player.hasLastStand && !player.lastStandUsedThisFloor) {
      player.health = 1;
      result.playerDefeated = false;
      result.lastStandTriggered = true;
      result.message += ` LAST STAND! You survive with 1 HP!`;
    }

    if (player.health > 0) {
      result.message += ` You have ${player.health}/${player.maxHealth} HP remaining.`;
    } else {
      result.message += ` You have been defeated!`;
      player.health = 0;
    }

    return result;
  }

  static isAdjacent(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return (dx <= 1 && dy <= 1) && (dx + dy > 0);
  }

  static getAdjacentEnemies(player, enemies) {
    // Defensive checks
    if (!player || !Array.isArray(enemies)) {
      return [];
    }
    
    // Only consider cardinal-adjacent (up/down/left/right) for encounters
    return enemies.filter(enemy => {
      if (!enemy || !(enemy.isAlive ?? (enemy.health > 0))) return false;
      if (typeof enemy.x !== 'number' || typeof enemy.y !== 'number') return false;
      if (typeof player.x !== 'number' || typeof player.y !== 'number') return false;
      
      const dx = Math.abs(player.x - enemy.x);
      const dy = Math.abs(player.y - enemy.y);
      return (dx + dy === 1);
    });
  }

  static getAdjacentPlayers(enemy, player) {
    if (!enemy.isAlive) return [];
    return this.isAdjacent(enemy, player) ? [player] : [];
  }

  // Handle automatic combat when player moves adjacent to enemy
  static handleAutoCombat(player, enemies) {
    const adjacentEnemies = this.getAdjacentEnemies(player, enemies);
    const combatResults = [];

    // Player attacks all adjacent enemies
    for (const enemy of adjacentEnemies) {
      const result = this.playerAttackEnemy(player, enemy);
      combatResults.push(result);
    }

    // Living enemies counter-attack
    const livingAdjacentEnemies = adjacentEnemies.filter(e => e.isAlive);
    for (const enemy of livingAdjacentEnemies) {
      const result = this.enemyAttackPlayer(enemy, player);
      combatResults.push(result);
      
      // If player dies, stop combat
      if (result.playerDefeated) {
        break;
      }
    }

    return combatResults;
  }

  // Handle enemy turn combat
  static handleEnemyTurnCombat(enemies, player) {
    const combatResults = [];

    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;

      const adjacentPlayers = this.getAdjacentPlayers(enemy, player);
      if (adjacentPlayers.length > 0) {
        const result = this.enemyAttackPlayer(enemy, player);
        combatResults.push(result);
        
        // If player dies, stop combat
        if (result.playerDefeated) {
          break;
        }
      }
    }

    return combatResults;
  }

  // Calculate experience needed for next level
  static getExperienceForLevel(level) {
    return level * 100;
  }

  // Handle player leveling up
  static handleLevelUp(player) {
    const experienceNeeded = this.getExperienceForLevel(player.level);
    
    if (player.experience >= experienceNeeded) {
      player.level++;
      player.experience -= experienceNeeded;
      
      // Increase stats on level up - scales with level
      // Every 5 levels, get bonus stats
      const isBonusLevel = player.level % 5 === 0;
      const levelTier = Math.floor(player.level / 5);
      
      const healthIncrease = 20 + (levelTier * 5) + (isBonusLevel ? 15 : 0);
      const attackIncrease = 2 + (isBonusLevel ? 1 : 0);
      const defenseIncrease = 1 + (isBonusLevel ? 1 : 0);
      const skillPointsGained = isBonusLevel ? 2 : 1; // More skill points on milestone levels
      
      player.maxHealth += healthIncrease;
      player.health = player.maxHealth; // Full heal on level up
      player.attack = (player.attack || 10) + attackIncrease;
      player.defense = (player.defense || 0) + defenseIncrease;
      player.skillPoints = (player.skillPoints || 0) + skillPointsGained;
      
      // Special message for bonus levels
      const message = isBonusLevel
        ? `🌟 MILESTONE LEVEL ${player.level}! 🌟 You feel significantly stronger! +${skillPointsGained} Skill Points!`
        : `Level up! You are now level ${player.level}! +${skillPointsGained} Skill Point!`;
      
      return {
        leveledUp: true,
        newLevel: player.level,
        healthIncrease,
        attackIncrease,
        defenseIncrease,
        skillPointsGained,
        isBonusLevel,
        message
      };
    }
    
    return { leveledUp: false };
  }

  // Apply combat rewards
  static applyRewards(player, combatResults) {
    let totalExperience = 0;
    let totalGold = 0;

    for (const result of combatResults) {
      if (result.experience) {
        totalExperience += result.experience;
      }
      if (result.gold) {
        totalGold += result.gold;
      }
    }

    player.experience = (player.experience || 0) + totalExperience;
    player.gold = (player.gold || 0) + totalGold;

    // Check for level up
    const levelUpResult = this.handleLevelUp(player);

    return {
      experience: totalExperience,
      gold: totalGold,
      levelUp: levelUpResult
    };
  }
}

