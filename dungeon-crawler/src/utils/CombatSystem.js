// Combat System for turn-based battles

export class CombatSystem {
  static calculateDamage(attacker, defender) {
    // Base damage with some randomness
    const baseDamage = attacker.attack || 10;
    const variance = Math.floor(baseDamage * 0.3);
    const randomDamage = baseDamage + Math.floor(Math.random() * variance) - Math.floor(variance / 2);
    
    // Crit chance (10%) doubles damage
    const isCrit = Math.random() < 0.1;
    const critDamage = isCrit ? Math.floor(randomDamage * 1.8) : randomDamage;
    
    // Apply defense
    const defense = defender.defense || 0;
    const finalDamage = Math.max(1, critDamage - defense);
    
    return { damage: finalDamage, isCrit };
  }

  static playerAttackEnemy(player, enemy) {
    const { damage, isCrit } = this.calculateDamage(player, enemy);
    const actualDamage = enemy.takeDamage(damage);
    
    const result = {
      damage: actualDamage,
      enemyDefeated: !enemy.isAlive,
      message: `You deal ${actualDamage} damage to ${enemy.name}!`,
      isCrit
    };

    if (enemy.isAlive) {
      result.message += ` ${enemy.name} has ${enemy.health}/${enemy.maxHealth} HP remaining.`;
    } else {
      result.message += ` ${enemy.name} is defeated!`;
      result.experience = enemy.experience;
      result.gold = enemy.gold;
    }

    return result;
  }

  static enemyAttackPlayer(enemy, player) {
    const { damage, isCrit } = this.calculateDamage(enemy, player);
    const actualDamage = Math.min(damage, player.health);
    
    player.health -= actualDamage;
    
    const result = {
      damage: actualDamage,
      playerDefeated: player.health <= 0,
      message: `${enemy.name} deals ${actualDamage} damage to you!`,
      isCrit
    };

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
    // Only consider cardinal-adjacent (up/down/left/right) for encounters
    return enemies.filter(enemy => {
      if (!enemy.isAlive) return false;
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
      
      // Increase stats on level up
      const healthIncrease = 20;
      const attackIncrease = 2;
      const defenseIncrease = 1;
      
      player.maxHealth += healthIncrease;
      player.health = player.maxHealth; // Full heal on level up
      player.attack = (player.attack || 10) + attackIncrease;
      player.defense = (player.defense || 0) + defenseIncrease;
      
      return {
        leveledUp: true,
        newLevel: player.level,
        healthIncrease,
        attackIncrease,
        defenseIncrease,
        message: `Level up! You are now level ${player.level}!`
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

