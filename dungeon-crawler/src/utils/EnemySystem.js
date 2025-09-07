// Enemy System with AI behaviors

// Import enemy sprites
import skeletonWarrior from '../assets/sprites/characters/skeleton_warrior.png';
import goblinArcher from '../assets/sprites/characters/goblin_archer.png';
import stoneGolem from '../assets/sprites/characters/stone_golem.png';
import shadowWraith from '../assets/sprites/characters/shadow_wraith.png';
import dungeonBoss from '../assets/sprites/characters/dungeon_boss.png';

export const ENEMY_TYPES = {
  SKELETON: 'skeleton',
  GOBLIN: 'goblin',
  GOLEM: 'golem',
  WRAITH: 'wraith',
  BOSS: 'boss'
};

export const ENEMY_STATS = {
  [ENEMY_TYPES.SKELETON]: {
    name: 'Skeleton Warrior',
    sprite: skeletonWarrior,
    health: 30,
    attack: 8,
    defense: 2,
    speed: 1,
    experience: 15,
    gold: 10,
    behavior: 'aggressive'
  },
  [ENEMY_TYPES.GOBLIN]: {
    name: 'Goblin Archer',
    sprite: goblinArcher,
    health: 20,
    attack: 12,
    defense: 1,
    speed: 2,
    experience: 12,
    gold: 8,
    behavior: 'ranged'
  },
  [ENEMY_TYPES.GOLEM]: {
    name: 'Stone Golem',
    sprite: stoneGolem,
    health: 60,
    attack: 15,
    defense: 8,
    speed: 0.5,
    experience: 30,
    gold: 25,
    behavior: 'defensive'
  },
  [ENEMY_TYPES.WRAITH]: {
    name: 'Shadow Wraith',
    sprite: shadowWraith,
    health: 25,
    attack: 18,
    defense: 0,
    speed: 3,
    experience: 25,
    gold: 15,
    behavior: 'magical'
  },
  [ENEMY_TYPES.BOSS]: {
    name: 'Dungeon Lord',
    sprite: dungeonBoss,
    health: 120,
    attack: 25,
    defense: 10,
    speed: 1,
    experience: 100,
    gold: 100,
    behavior: 'boss'
  }
};

export class Enemy {
  constructor(type, x, y, id) {
    const stats = ENEMY_STATS[type];
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.name = stats.name;
    this.sprite = stats.sprite;
    this.maxHealth = stats.health;
    this.health = stats.health;
    this.attack = stats.attack;
    this.defense = stats.defense;
    this.speed = stats.speed;
    this.experience = stats.experience;
    this.gold = stats.gold;
    this.behavior = stats.behavior;
    this.lastMoveTime = 0;
    this.isAlive = true;
  }

  // Calculate distance to target
  distanceTo(target) {
    return Math.abs(this.x - target.x) + Math.abs(this.y - target.y);
  }

  // Check if target is in line of sight
  canSee(target, dungeon) {
    const dx = Math.sign(target.x - this.x);
    const dy = Math.sign(target.y - this.y);
    
    let x = this.x + dx;
    let y = this.y + dy;
    
    while (x !== target.x || y !== target.y) {
      if (dungeon[y] && dungeon[y][x] === 'wall') {
        return false;
      }
      x += dx;
      y += dy;
    }
    
    return true;
  }

  // Get valid moves for this enemy
  getValidMoves(dungeon, enemies, player) {
    const moves = [];
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }   // right
    ];

    for (const dir of directions) {
      const newX = this.x + dir.dx;
      const newY = this.y + dir.dy;

      // Check bounds
      if (newX < 0 || newX >= dungeon[0].length || newY < 0 || newY >= dungeon.length) {
        continue;
      }

      // Check for walls
      if (dungeon[newY][newX] === 'wall') {
        continue;
      }

      // Check for other enemies
      const enemyAtPosition = enemies.find(e => e.x === newX && e.y === newY && e.id !== this.id);
      if (enemyAtPosition) {
        continue;
      }

      moves.push({ x: newX, y: newY, dx: dir.dx, dy: dir.dy });
    }

    return moves;
  }

  // AI behavior for enemy movement
  getNextMove(dungeon, enemies, player, turn) {
    if (!this.isAlive) return null;

    // Speed check - some enemies move slower
    if (turn % Math.ceil(2 / this.speed) !== 0) {
      return null;
    }

    const validMoves = this.getValidMoves(dungeon, enemies, player);
    if (validMoves.length === 0) return null;

    const distanceToPlayer = this.distanceTo(player);
    const canSeePlayer = this.canSee(player, dungeon);

    switch (this.behavior) {
      case 'aggressive':
        // Move towards player if can see them
        if (canSeePlayer && distanceToPlayer <= 6) {
          return this.moveTowardsTarget(player, validMoves);
        }
        // Otherwise move randomly
        return validMoves[Math.floor(Math.random() * validMoves.length)];

      case 'ranged':
        // Try to maintain distance of 2-4 from player
        if (canSeePlayer) {
          if (distanceToPlayer < 2) {
            return this.moveAwayFromTarget(player, validMoves);
          } else if (distanceToPlayer > 4) {
            return this.moveTowardsTarget(player, validMoves);
          }
          // Stay in position if at good range
          return null;
        }
        return validMoves[Math.floor(Math.random() * validMoves.length)];

      case 'defensive':
        // Only move if player is very close
        if (canSeePlayer && distanceToPlayer <= 2) {
          return this.moveTowardsTarget(player, validMoves);
        }
        return null;

      case 'magical':
        // Teleport-like movement, can move through some obstacles
        if (canSeePlayer && distanceToPlayer <= 8) {
          return this.moveTowardsTarget(player, validMoves);
        }
        return validMoves[Math.floor(Math.random() * validMoves.length)];

      case 'boss':
        // Intelligent movement towards player
        if (distanceToPlayer <= 10) {
          return this.moveTowardsTarget(player, validMoves);
        }
        return null;

      default:
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  }

  // Move towards a target
  moveTowardsTarget(target, validMoves) {
    let bestMove = null;
    let bestDistance = Infinity;

    for (const move of validMoves) {
      const distance = Math.abs(move.x - target.x) + Math.abs(move.y - target.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Move away from a target
  moveAwayFromTarget(target, validMoves) {
    let bestMove = null;
    let bestDistance = 0;

    for (const move of validMoves) {
      const distance = Math.abs(move.x - target.x) + Math.abs(move.y - target.y);
      if (distance > bestDistance) {
        bestDistance = distance;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Take damage
  takeDamage(damage) {
    const actualDamage = Math.max(1, damage - this.defense);
    this.health -= actualDamage;
    
    if (this.health <= 0) {
      this.health = 0;
      this.isAlive = false;
    }
    
    return actualDamage;
  }

  // Attack calculation
  getAttackDamage() {
    // Add some randomness to attacks
    const variance = Math.floor(this.attack * 0.2);
    return this.attack + Math.floor(Math.random() * variance) - Math.floor(variance / 2);
  }
}

// Factory function to create enemies
export const createEnemy = (type, x, y, id) => {
  return new Enemy(type, x, y, id);
};

// Generate random enemy types for spawning
export const getRandomEnemyType = (level = 1) => {
  const types = Object.values(ENEMY_TYPES);
  
  // Adjust enemy types based on level
  if (level === 1) {
    // Early levels: mostly skeletons and goblins
    const earlyTypes = [ENEMY_TYPES.SKELETON, ENEMY_TYPES.GOBLIN];
    return earlyTypes[Math.floor(Math.random() * earlyTypes.length)];
  } else if (level <= 3) {
    // Mid levels: add golems
    const midTypes = [ENEMY_TYPES.SKELETON, ENEMY_TYPES.GOBLIN, ENEMY_TYPES.GOLEM];
    return midTypes[Math.floor(Math.random() * midTypes.length)];
  } else if (level <= 5) {
    // Higher levels: add wraiths
    const highTypes = [ENEMY_TYPES.SKELETON, ENEMY_TYPES.GOBLIN, ENEMY_TYPES.GOLEM, ENEMY_TYPES.WRAITH];
    return highTypes[Math.floor(Math.random() * highTypes.length)];
  } else {
    // Boss levels: chance for boss
    if (Math.random() < 0.3) {
      return ENEMY_TYPES.BOSS;
    }
    return types[Math.floor(Math.random() * (types.length - 1))]; // Exclude boss from random
  }
};

