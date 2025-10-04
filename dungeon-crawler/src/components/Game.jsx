import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import GameBoard from './GameBoard';
import GameHUD from './GameHUD';
import MenuPanel from './MenuPanel';
import PlayerStats from './PlayerStats';
import Inventory from './Inventory';
import CombatLog from './CombatLog';
import GameOverScreen from './GameOverScreen';
import BattleInterface from './BattleInterface';
import LevelUpNotification from './LevelUpNotification';
import SkillTree from './SkillTree';
import Tutorial from './Tutorial';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateDungeon } from '../utils/DungeonGenerator';
import { createEnemy, getRandomEnemyType } from '../utils/EnemySystem';
import { CombatSystem } from '../utils/CombatSystem';
import { getChestLoot, applyItemStats, removeItemStats, ITEM_TYPES } from '../utils/ItemSystem';
import { selectDungeonTheme, generateEnemyName, generateWeaponLoot, applyThemeMultipliers } from '../utils/ProceduralGenerator';
import { SkillSystem, SKILLS } from '../utils/SkillSystem';
import { Heart, ScrollText, Eye, EyeOff, Sparkles } from 'lucide-react';

// Import bag icon
import inventoryBag from '../assets/sprites/ui/inventory_bag.png';

// Custom bag icon component
const BagIcon = ({ className }) => (
  <img 
    src={inventoryBag} 
    alt="Inventory" 
    className={className}
    style={{ imageRendering: 'pixelated' }}
  />
);

// Game constants
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 10;
const TILE_SIZE = 64;

// Initial player state
const initialPlayer = {
  x: 1,
  y: 1,
  health: 100,
  maxHealth: 100,
  level: 1,
  experience: 0,
  gold: 0,
  attack: 10,
  defense: 2,
  direction: 'front',
  // Skill-related properties
  skillPoints: 2, // Start with 2 skill points
  critChance: 0.1, // 10% base crit chance
  critDamage: 1.8, // 180% crit damage
  lifesteal: 0,
  damageReduction: 0,
  regeneration: 0,
  hasLastStand: false,
  lastStandUsedOnFloor: -1
};

// Initial inventory
const initialInventory = {
  weapon: null,
  armor: null,
  items: []
};

const Game = () => {
  const [player, setPlayer] = useState(initialPlayer);
  const [inventory, setInventory] = useState(initialInventory);
  const [dungeon, setDungeon] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'battle', 'paused', 'gameOver'
  const [turn, setTurn] = useState(0);
  const [dungeonLevel, setDungeonLevel] = useState(1);
  const [dungeonTheme, setDungeonTheme] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [exploredTiles, setExploredTiles] = useState(new Set());
  
  // Simple UI visibility toggle (currently unused but kept for future features)
  const [_showUI, setShowUI] = useState(true);

  // Performance optimization refs
  const movementTimeoutRef = useRef(null);
  const enemyTurnTimeoutRef = useRef(null);
  const interactionTimeoutRef = useRef(null);
  const lastMoveTimeRef = useRef(0);
  const combatProcessingRef = useRef(false);
  const turnRef = useRef(0);

  // Battle state
  const [battle, setBattle] = useState({
    active: false,
    currentEnemyId: null,
    queue: [],
    lastMessage: null,
    playerTurn: true
  });
  const [battleFx, setBattleFx] = useState({ enemyShake: false, playerShake: false, floats: [] });
  const battleTimeoutsRef = useRef([]);
  
  // Level up state
  const [levelUpData, setLevelUpData] = useState(null);

  // Skills state
  const [learnedSkills, setLearnedSkills] = useState({});
  const [skillCooldowns, setSkillCooldowns] = useState({});
  const [playerBuffs, setPlayerBuffs] = useState({});  // Used for temporary skill effects like Shield Block

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);

  const clearBattleTimeouts = useCallback(() => {
    battleTimeoutsRef.current.forEach(id => clearTimeout(id));
    battleTimeoutsRef.current = [];
  }, []);
  
  // Keep turnRef in sync with turn state
  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);

  // Check if tutorial should be shown on first load
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('dungeonCrawlerTutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  // Menu state
  const [openMenus, setOpenMenus] = useState({
    inventory: false,
    stats: false,
    log: false,
    skills: false
  });

  // Toggle menu visibility
  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Simple UI toggle function
  const toggleUI = useCallback(() => {
    setShowUI(prev => !prev);
  }, []);

  // Toggle pause state
  const togglePause = () => {
    setGameState(prev => prev === 'paused' ? 'playing' : 'paused');
  };


  // Handle item usage
  const handleUseItem = useCallback((item, index) => {
    if (item.type === 'consumable') {
      if (item.health) {
        setPlayer(prev => {
          const newHealth = Math.min(prev.maxHealth, prev.health + item.health);
          return { ...prev, health: newHealth };
        });
        setCombatLog(prev => [...prev.slice(-9), { message: `Used ${item.name}! Restored ${item.health} health.`, turn: turnRef.current }]);
      }
      
      // Remove item from inventory
      setInventory(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  }, []);

  // Handle unequipping items
  const handleUnequipItem = useCallback((itemType) => {
    if (itemType === 'weapon' && inventory.weapon) {
      const weaponName = inventory.weapon.name;
      setPlayer(prev => removeItemStats({ ...prev }, inventory.weapon));
      setInventory(prev => ({ ...prev, weapon: null }));
      setCombatLog(prev => [...prev.slice(-9), { message: `Unequipped ${weaponName}`, turn: turnRef.current }]);
    } else if (itemType === 'armor' && inventory.armor) {
      const armorName = inventory.armor.name;
      setPlayer(prev => removeItemStats({ ...prev }, inventory.armor));
      setInventory(prev => ({ ...prev, armor: null }));
      setCombatLog(prev => [...prev.slice(-9), { message: `Unequipped ${armorName}`, turn: turnRef.current }]);
    }
  }, [inventory.weapon, inventory.armor]);

  // Handle equipping items from inventory
  const handleEquipItem = useCallback((item, index) => {
    if (item.type === ITEM_TYPES.WEAPON) {
      // Unequip current weapon if any
      if (inventory.weapon) {
        setPlayer(prev => removeItemStats({ ...prev }, inventory.weapon));
        setCombatLog(prev => [...prev.slice(-9), { message: `Unequipped ${inventory.weapon.name}`, turn: turnRef.current }]);
      }
      
      // Equip new weapon
      setInventory(prev => ({ 
        ...prev, 
        weapon: item,
        items: prev.items.filter((_, i) => i !== index)
      }));
      setPlayer(prev => applyItemStats({ ...prev }, item));
      setCombatLog(prev => [...prev.slice(-9), { message: `Equipped ${item.name}!`, turn: turnRef.current }]);
      
    } else if (item.type === ITEM_TYPES.ARMOR) {
      // Unequip current armor if any
      if (inventory.armor) {
        setPlayer(prev => removeItemStats({ ...prev }, inventory.armor));
        setCombatLog(prev => [...prev.slice(-9), { message: `Unequipped ${inventory.armor.name}`, turn: turnRef.current }]);
      }
      
      // Equip new armor
      setInventory(prev => ({ 
        ...prev, 
        armor: item,
        items: prev.items.filter((_, i) => i !== index)
      }));
      setPlayer(prev => applyItemStats({ ...prev }, item));
      setCombatLog(prev => [...prev.slice(-9), { message: `Equipped ${item.name}!`, turn: turnRef.current }]);
    }
  }, [inventory.weapon, inventory.armor]);

  // Handle selling items
  const handleSellItem = useCallback((item, index) => {
    const sellPrice = Math.floor((item.value || 10) * 0.6); // Sell for 60% of value
    
    // Add gold to player
    setPlayer(prev => ({ ...prev, gold: prev.gold + sellPrice }));
    
    // Remove item from inventory
    setInventory(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
    
    // Log the sale
    setCombatLog(prev => [...prev.slice(-9), { 
      message: `Sold ${item.name} for ${sellPrice} gold!`, 
      turn: turnRef.current 
    }]);
  }, []);

  // Get current enemy in battle - memoized for performance with null safety
  const currentEnemy = useMemo(() => {
    if (!battle.active || !battle.currentEnemyId) return null;
    if (!Array.isArray(enemies) || enemies.length === 0) return null;
    
    const enemy = enemies.find(e => e && e.id === battle.currentEnemyId);
    
    // Validate enemy has required properties
    if (enemy && (!enemy.health || !enemy.maxHealth || !enemy.name)) {
      console.warn('Invalid enemy state detected:', enemy);
      return null;
    }
    
    return enemy || null;
  }, [battle.active, battle.currentEnemyId, enemies]);

  // Handle learning a skill
  const handleLearnSkill = useCallback((skillId) => {
    const skill = SKILLS[skillId];
    if (!skill) return;
    
    const currentLevel = learnedSkills[skillId] || 0;
    const cost = SkillSystem.getSkillCost(skillId, currentLevel);
    
    // Check if can learn
    if (!SkillSystem.canLearnSkill(skillId, learnedSkills)) {
      setCombatLog(prev => [...prev.slice(-9), { 
        message: `Cannot learn ${skill.name} - requirements not met!`, 
        turn: turnRef.current 
      }]);
      return;
    }
    
    if (player.skillPoints < cost) {
      setCombatLog(prev => [...prev.slice(-9), { 
        message: `Not enough skill points! Need ${cost}, have ${player.skillPoints}.`, 
        turn: turnRef.current 
      }]);
      return;
    }
    
    // Learn the skill
    setLearnedSkills(prev => ({
      ...prev,
      [skillId]: (prev[skillId] || 0) + 1
    }));
    
    setPlayer(prev => ({
      ...prev,
      skillPoints: prev.skillPoints - cost
    }));
    
    setCombatLog(prev => [...prev.slice(-9), { 
      message: `Learned ${skill.name} Level ${currentLevel + 1}!`, 
      turn: turnRef.current 
    }]);
    
    // Apply passive skills immediately
    setPlayer(prev => SkillSystem.applyPassiveSkills(prev, { ...learnedSkills, [skillId]: currentLevel + 1 }));
    
    // Check for Last Stand passive
    if (skillId === 'last_stand') {
      setPlayer(prev => ({ ...prev, hasLastStand: true }));
    }
  }, [learnedSkills, player.skillPoints]);

  // Handle using an active skill
  const handleUseSkill = useCallback((skillId) => {
    const skill = SKILLS[skillId];
    if (!skill) return;
    
    const level = learnedSkills[skillId] || 0;
    if (level === 0) return;
    
    const cooldown = skillCooldowns[skillId] || 0;
    if (cooldown > 0) {
      setCombatLog(prev => [...prev.slice(-9), { 
        message: `${skill.name} is on cooldown! (${cooldown} turns remaining)`, 
        turn: turnRef.current 
      }]);
      return;
    }
    
    // Activate the skill
    const result = SkillSystem.activateSkill(skillId, level, player, currentEnemy ? [currentEnemy] : []);
    
    if (result.success) {
      setCombatLog(prev => [...prev.slice(-9), { 
        message: result.message, 
        turn: turnRef.current 
      }]);
      
      // Set cooldown
      setSkillCooldowns(prev => ({
        ...prev,
        [skillId]: skill.cooldown
      }));
      
      // Apply skill effects
      if (result.healAmount) {
        setPlayer(prev => ({ ...prev, health: result.newHealth }));
      }
      
      if (result.applyBuff) {
        setPlayerBuffs(prev => ({
          ...prev,
          [result.applyBuff.type]: result.applyBuff
        }));
      }
      
      // If it's a damage skill, store for next attack
      if (result.damageMultiplier) {
        // This will be handled in the battle attack function
        return { ...result, skillId };
      }
    }
    
    return result;
  }, [learnedSkills, skillCooldowns, player, currentEnemy]);

  // Update explored tiles based on player vision radius
  const updateExploredTiles = useCallback((playerX, playerY, visionRadius = 4) => {
    setExploredTiles(prev => {
      const newExplored = new Set(prev);
      
      // Reveal tiles within vision radius
      for (let dy = -visionRadius; dy <= visionRadius; dy++) {
        for (let dx = -visionRadius; dx <= visionRadius; dx++) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= visionRadius) {
            const tileX = playerX + dx;
            const tileY = playerY + dy;
            
            // Check if tile is within bounds
            if (tileX >= 0 && tileX < BOARD_WIDTH && tileY >= 0 && tileY < BOARD_HEIGHT) {
              newExplored.add(`${tileX},${tileY}`);
            }
          }
        }
      }
      
      return newExplored;
    });
  }, []);

  // Generate a new dungeon level with enemy limit
  const generateNewDungeon = useCallback((level = 1) => {
    try {
      // Clear any active enemy turn processing to prevent stale callbacks
      if (enemyTurnTimeoutRef.current) {
        clearTimeout(enemyTurnTimeoutRef.current);
        enemyTurnTimeoutRef.current = null;
      }
      
      // Clear movement locks to allow player to move on new floor
      if (movementTimeoutRef.current) {
        clearTimeout(movementTimeoutRef.current);
        movementTimeoutRef.current = null;
      }
      setIsMoving(false);
      combatProcessingRef.current = false;
      lastMoveTimeRef.current = 0;
      
      // Reset turn counter for new floor
      setTurn(0);
      turnRef.current = 0;
      
      // Select theme for this level
      const theme = selectDungeonTheme(level);
      setDungeonTheme(theme);
      
      const dungeonData = generateDungeon(BOARD_WIDTH, BOARD_HEIGHT);
      setDungeon(dungeonData.dungeon);
      
      // Create enemies from spawn points - LIMIT TO 5 ENEMIES MAX
      const maxEnemies = Math.min(5, dungeonData.enemySpawns.length);
      const limitedSpawns = dungeonData.enemySpawns.slice(0, maxEnemies);
      
      const newEnemies = limitedSpawns.map((spawn, index) => {
        const enemyType = getRandomEnemyType(level);
        const enemy = createEnemy(enemyType, spawn.x, spawn.y, `enemy_${index}`);
        
        // Apply theme multipliers to enemy stats
        const themedStats = applyThemeMultipliers({
          health: enemy.maxHealth,
          attack: enemy.attack,
          defense: enemy.defense,
          gold: enemy.gold,
          experience: enemy.experience
        }, theme);
        
        // Generate unique name for enemy
        const generatedName = generateEnemyName(enemyType, theme);
        
        // Update enemy with theme adjustments
        enemy.name = generatedName;
        enemy.maxHealth = themedStats.health;
        enemy.health = themedStats.health;
        enemy.attack = themedStats.attack;
        enemy.defense = themedStats.defense;
        enemy.gold = themedStats.gold;
        enemy.experience = themedStats.experience;
        
        return enemy;
      });
      
      setEnemies(newEnemies);
      console.log(`Generated ${newEnemies.length} ${theme.name} enemies for level ${level}`);
      
      // Verify enemies are class instances
      if (newEnemies.length > 0) {
        console.log('Enemy type check:', typeof newEnemies[0].getNextMove, newEnemies[0].constructor.name);
      }
      
      // Reset player position
      setPlayer(prev => ({
        ...prev,
        x: dungeonData.playerStart.x,
        y: dungeonData.playerStart.y,
        direction: 'front'
      }));
      
      // Add themed log message
      setCombatLog(prev => [...prev.slice(-9), { 
        message: `Entered ${theme.name} - Level ${level}`, 
        turn: 0 
      }]);
      
      // Reset and initialize fog of war
      setExploredTiles(new Set());
      setTimeout(() => {
        updateExploredTiles(dungeonData.playerStart.x, dungeonData.playerStart.y);
      }, 0);
      
    } catch (error) {
      console.error('Dungeon generation error:', error);
      // Fallback: create minimal dungeon
      setDungeon(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill('floor')));
      setEnemies([]);
      setPlayer(prev => ({ ...prev, x: 1, y: 1, direction: 'front' }));
      setExploredTiles(new Set());
      setTimeout(() => updateExploredTiles(1, 1), 0);
    }
  }, [updateExploredTiles]);

  // Initialize dungeon on component mount
  useEffect(() => {
    generateNewDungeon(1);
  }, [generateNewDungeon]);

  // Reset movement lock when game state changes
  useEffect(() => {
    if (gameState !== 'playing') {
      setIsMoving(false);
    }
  }, [gameState]);

  // Handle player movement with optimizations
  const movePlayer = useCallback((dx, dy) => {
    // Performance checks - prevent concurrent movement processing
    if (gameState !== 'playing' || isMoving || combatProcessingRef.current) {
      return;
    }
    
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 100) { // Increased throttle for stability
      return;
    }
    lastMoveTimeRef.current = now;
    
    setIsMoving(true);
    combatProcessingRef.current = true;
    
    // Clear any existing timeout
    if (movementTimeoutRef.current) {
      clearTimeout(movementTimeoutRef.current);
    }
    
    // Safety timeout to prevent permanent movement lock
    movementTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
      combatProcessingRef.current = false;
      console.warn('Movement timeout triggered - unlocking movement');
    }, 1500); // Reduced to 1.5 seconds for better responsiveness

    setPlayer(prevPlayer => {
      const newX = prevPlayer.x + dx;
      const newY = prevPlayer.y + dy;
      
      // Check bounds
      if (newX < 0 || newX >= BOARD_WIDTH || newY < 0 || newY >= BOARD_HEIGHT) {
        if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
        setIsMoving(false);
        combatProcessingRef.current = false;
        return prevPlayer;
      }
      
      // Check for walls with null safety
      if (!dungeon || !Array.isArray(dungeon) || !dungeon[newY] || !Array.isArray(dungeon[newY])) {
        console.warn('Invalid dungeon state during movement');
        if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
        setIsMoving(false);
        combatProcessingRef.current = false;
        return prevPlayer;
      }
      
      if (dungeon[newY][newX] === 'wall') {
        if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
        setIsMoving(false);
        combatProcessingRef.current = false;
        return prevPlayer;
      }
      
      // Update direction based on movement
      let direction = prevPlayer.direction;
      if (dx > 0) direction = 'right';
      else if (dx < 0) direction = 'left';
      else if (dy > 0) direction = 'front';
      else if (dy < 0) direction = 'back';
      
      // Prevent walking onto an enemy's tile with null safety
      const enemyOnTarget = Array.isArray(enemies) 
        ? enemies.find(e => e && e.isAlive && e.x === newX && e.y === newY) 
        : null;

      const newPlayer = enemyOnTarget
        ? { ...prevPlayer, direction }
        : { ...prevPlayer, x: newX, y: newY, direction };

      // Update fog of war when player moves to new position
      if (!enemyOnTarget) {
        try {
          setTimeout(() => updateExploredTiles(newX, newY), 0);
        } catch (err) {
          console.error('Error updating explored tiles:', err);
        }
      }

      // Trigger encounter if adjacent to enemies
      try {
        const adjacent = CombatSystem.getAdjacentEnemies(newPlayer, enemies);
        if (adjacent && Array.isArray(adjacent) && adjacent.length > 0) {
          // Create battle queue (fight one-by-one)
          const queueIds = adjacent.map(e => e.id);
          setBattle({
            active: true,
            currentEnemyId: queueIds[0],
            queue: queueIds.slice(1),
            lastMessage: 'A wild enemy appears!',
            playerTurn: true
          });
          setGameState('battle');
          setBattleFx({ enemyShake: false, playerShake: false, floats: [] });
        }
      } catch (error) {
        console.error('Encounter processing error:', error);
      } finally {
        // Always re-enable movement
        if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
        setIsMoving(false);
        combatProcessingRef.current = false;
      }
      
      return newPlayer;
    });
    
    // Increment turn counter
    setTurn(prevTurn => prevTurn + 1);
  }, [gameState, dungeon, enemies, isMoving, updateExploredTiles]);

  // Battle helpers
  const endBattleIfNeeded = useCallback((updatedPlayer) => {
    // If more enemies queued, start next
    if (battle.queue.length > 0) {
      const [nextId, ...rest] = battle.queue;
      setBattle(prev => ({ ...prev, currentEnemyId: nextId, queue: rest, playerTurn: true }));
      setBattleFx({ enemyShake: false, playerShake: false, floats: [] });
      return;
    }
    // Otherwise return to exploration
    setBattle({ active: false, currentEnemyId: null, queue: [], lastMessage: null, playerTurn: true });
    setGameState('playing');
    if (updatedPlayer) setPlayer(prev => ({ ...prev, ...updatedPlayer }));
    setBattleFx({ enemyShake: false, playerShake: false, floats: [] });
    clearBattleTimeouts();
  }, [battle.queue, clearBattleTimeouts]);

  const pushFloat = useCallback((side, amount, color) => {
    const id = Date.now() + Math.random();
    setBattleFx(prev => ({
      ...prev,
      floats: [...(prev.floats || []), { id, side, text: `-${amount}`, color }]
    }));
    const tid = setTimeout(() => {
      setBattleFx(prev => ({
        ...prev,
        floats: (prev.floats || []).filter(f => f.id !== id)
      }));
    }, 800);
    battleTimeoutsRef.current.push(tid);
  }, []);

  const handleBattleAttack = useCallback(() => {
    if (!battle.active || !battle.playerTurn) return;
    if (!currentEnemy) {
      console.warn('Battle attack called but no current enemy');
      return;
    }

    try {
      // Clone objects for safe updates
      const enemyRef = currentEnemy;
      const playerClone = { ...player };
      const result = CombatSystem.playerAttackEnemy(playerClone, enemyRef);

    // Update enemy state
    // Preserve class instance reference to keep methods like takeDamage working
    setEnemies(prev => prev.map(e => e.id === enemyRef.id ? enemyRef : e));

    // Log message
    setCombatLog(prev => [...prev.slice(-9), { message: result.message, turn: turnRef.current + 1 }]);

    // Visual shake on enemy
    setBattleFx(prev => ({ ...prev, enemyShake: true }));
    const t1 = setTimeout(() => setBattleFx(prev => ({ ...prev, enemyShake: false })), 180);
    battleTimeoutsRef.current.push(t1);
    pushFloat('enemy', result.damage, result.isCrit ? '#facc15' : '#ef4444');
    if (result.isCrit) {
      pushFloat('enemy', 'CRIT!', '#fde047');
    }

    // If enemy defeated, grant rewards and proceed
    if (result.enemyDefeated) {
      const rewards = CombatSystem.applyRewards(playerClone, [result]);
      setPlayer(prev => ({
        ...prev,
        experience: playerClone.experience,
        gold: playerClone.gold,
        health: playerClone.health,
        level: playerClone.level,
        maxHealth: playerClone.maxHealth,
        attack: playerClone.attack,
        defense: playerClone.defense
      }));
      setEnemies(prev => prev.filter(e => e.isAlive));

      const messages = [];
      if (rewards.experience > 0) messages.push(`Gained ${rewards.experience} XP and ${rewards.gold} gold!`);
      if (rewards.levelUp && rewards.levelUp.leveledUp) {
        messages.push(rewards.levelUp.message);
        // Show level up notification
        setLevelUpData(rewards.levelUp);
      }
      if (messages.length > 0) {
        setCombatLog(prev => {
          const newMessages = messages.map((m, i) => ({ message: m, turn: turnRef.current + 1 + i }));
          return [...prev.slice(-(10 - newMessages.length)), ...newMessages];
        });
      }

      endBattleIfNeeded();
      return;
    }

    // Switch to enemy turn, then resolve enemy attack slightly later for feedback
    setBattle(prev => ({ ...prev, playerTurn: false }));

    const counterTimeout = setTimeout(() => {
      const enemyAttack = CombatSystem.enemyAttackPlayer(enemyRef, playerClone, playerBuffs);
      setPlayer(prev => ({ ...prev, health: playerClone.health }));
      setCombatLog(prev => [...prev.slice(-9), { message: enemyAttack.message, turn: turnRef.current + 2 }]);

      // Player shake on hit
      setBattleFx(prev => ({ ...prev, playerShake: true }));
      const t2 = setTimeout(() => setBattleFx(prev => ({ ...prev, playerShake: false })), 180);
      battleTimeoutsRef.current.push(t2);
      pushFloat('player', enemyAttack.damage, enemyAttack.isCrit ? '#facc15' : '#f97316');
      if (enemyAttack.isCrit) {
        pushFloat('player', 'CRIT!', '#fde047');
      }

      if (enemyAttack.playerDefeated) {
        setGameState('gameOver');
        setBattle(prev => ({ ...prev, active: false }));
        setCombatLog(prev => [...prev.slice(-9), { message: 'Game Over! You have been defeated.', turn: turnRef.current + 3 }]);
        clearBattleTimeouts();
        return;
      }

        // Back to player's turn
      setBattle(prev => ({ ...prev, playerTurn: true }));
    }, 220);
    battleTimeoutsRef.current.push(counterTimeout);
    
    } catch (error) {
      console.error('Battle attack error:', error);
      // Fallback: end battle if something goes wrong
      endBattleIfNeeded();
    }
  }, [battle.active, battle.playerTurn, currentEnemy, player, playerBuffs, endBattleIfNeeded, clearBattleTimeouts, pushFloat]);

  const handleBattleRun = useCallback(() => {
    if (!battle.active) return;
    setBattle({ active: false, currentEnemyId: null, queue: [], lastMessage: 'You fled the battle.', playerTurn: true });
    setGameState('playing');
    setBattleFx({ enemyShake: false, playerShake: false, floats: [] });
    clearBattleTimeouts();
  }, [battle.active, clearBattleTimeouts]);

  const handleBattleUseItem = useCallback(() => {
    if (!battle.active || !battle.playerTurn) return;
    // Use first consumable if present
    const index = Array.isArray(inventory.items) ? inventory.items.findIndex(i => i.type === 'consumable') : -1;
    if (index === -1) return;
    const item = inventory.items[index];
    if (item.health) {
      setPlayer(prev => ({ ...prev, health: Math.min(prev.maxHealth, prev.health + item.health) }));
      setCombatLog(prev => [...prev.slice(-9), { message: `Used ${item.name}! Restored ${item.health} HP.`, turn: turnRef.current + 1 }]);
    }
    setInventory(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

    // Using an item consumes your turn → enemy counterattacks
    if (!currentEnemy) return;
    setBattle(prev => ({ ...prev, playerTurn: false }));
    const enemyRef = currentEnemy;
    const playerClone = { ...player };
    const counterTimeout = setTimeout(() => {
      const enemyAttack = CombatSystem.enemyAttackPlayer(enemyRef, playerClone, playerBuffs);
      setPlayer(prev => ({ ...prev, health: playerClone.health }));
      setCombatLog(prev => [...prev.slice(-9), { message: enemyAttack.message, turn: turnRef.current + 2 }]);
      setBattleFx(prev => ({ ...prev, playerShake: true }));
      const t2 = setTimeout(() => setBattleFx(prev => ({ ...prev, playerShake: false })), 180);
      battleTimeoutsRef.current.push(t2);
      pushFloat('player', enemyAttack.damage, '#f97316');

      if (enemyAttack.playerDefeated) {
        setGameState('gameOver');
        setBattle(prev => ({ ...prev, active: false }));
        setCombatLog(prev => [...prev.slice(-9), { message: 'Game Over! You have been defeated.', turn: turnRef.current + 3 }]);
        clearBattleTimeouts();
        return;
      }
      setBattle(prev => ({ ...prev, playerTurn: true }));
    }, 220);
    battleTimeoutsRef.current.push(counterTimeout);
  }, [battle.active, battle.playerTurn, inventory.items, currentEnemy, player, playerBuffs, clearBattleTimeouts, pushFloat]);

  // Handle enemy turns - RE-ENABLED WITH ENHANCED AI
  useEffect(() => {
    if (gameState !== 'playing' || turn === 0 || isMoving || combatProcessingRef.current) return;

    // Clear any existing enemy turn timeout
    if (enemyTurnTimeoutRef.current) {
      clearTimeout(enemyTurnTimeoutRef.current);
    }

    // Process enemy turns with a small delay (optimized)
    enemyTurnTimeoutRef.current = setTimeout(() => {
      setEnemies(prevEnemies => {
        // Defensive checks
        if (!Array.isArray(prevEnemies) || prevEnemies.length === 0) {
          return prevEnemies;
        }
        
        // Filter living enemies first for better performance
        const livingEnemies = prevEnemies.filter(e => e && e.isAlive);
        if (livingEnemies.length === 0) return prevEnemies;

        let hasChanges = false;
        
        // Process enemy movements - mutate in place to preserve class methods
        prevEnemies.forEach(enemy => {
          if (!enemy || !enemy.isAlive) return;

          // Defensive check: ensure enemy still has getNextMove method
          if (typeof enemy.getNextMove !== 'function') {
            console.error('Enemy lost class methods! Type:', enemy.constructor?.name || 'Unknown', 'Enemy:', enemy);
            return;
          }

          try {
            // Get next move from enemy AI with null safety
            if (!dungeon || !Array.isArray(dungeon) || !player) {
              return;
            }
            
            const move = enemy.getNextMove(dungeon, prevEnemies, player, turn);
            
            if (move && typeof move.x === 'number' && typeof move.y === 'number' && 
                (move.x !== enemy.x || move.y !== enemy.y)) {
              hasChanges = true;
              // Update enemy position directly (preserves class instance)
              enemy.x = move.x;
              enemy.y = move.y;
            }
          } catch (err) {
            console.error('Error in enemy AI movement:', err, enemy);
          }
        });

        // Only trigger re-render if changes were made
        return hasChanges ? [...prevEnemies] : prevEnemies;
      });

      // Apply regeneration
      if (player.regeneration > 0) {
        setPlayer(prev => ({
          ...prev,
          health: SkillSystem.applyRegeneration(prev, learnedSkills)
        }));
      }

      // Reduce skill cooldowns (optimized to avoid unnecessary updates)
      setSkillCooldowns(prev => {
        const keys = Object.keys(prev);
        if (keys.length === 0) return prev;
        
        const updated = {};
        let hasChanges = false;
        
        keys.forEach(skillId => {
          const newCooldown = Math.max(0, prev[skillId] - 1);
          if (newCooldown > 0) {
            updated[skillId] = newCooldown;
            hasChanges = true;
          } else if (prev[skillId] > 0) {
            hasChanges = true; // Cooldown expired
          }
        });
        
        return hasChanges ? updated : prev;
      });

      // Reduce buff durations (optimized)
      setPlayerBuffs(prev => {
        const keys = Object.keys(prev);
        if (keys.length === 0) return prev;
        
        const updated = {};
        let hasChanges = false;
        
        keys.forEach(buffType => {
          const buff = prev[buffType];
          if (buff.duration) {
            const newDuration = buff.duration - 1;
            if (newDuration > 0) {
              updated[buffType] = { ...buff, duration: newDuration };
              hasChanges = true;
            } else {
              hasChanges = true; // Buff expired
            }
          } else {
            updated[buffType] = buff;
          }
        });
        
        return hasChanges ? updated : prev;
      });
    }, 100);

    return () => {
      if (enemyTurnTimeoutRef.current) {
        clearTimeout(enemyTurnTimeoutRef.current);
      }
    };
  }, [turn, gameState, dungeon, player, isMoving, learnedSkills]);

  // Handle keyboard input with optimized debouncing
  useEffect(() => {
    let lastKeyPress = 0;
    const DEBOUNCE_TIME = 75; // Reduced debounce for better responsiveness
    
    const handleKeyPress = (event) => {
      if (gameState !== 'playing' || isMoving || combatProcessingRef.current) return;
      
      const now = Date.now();
      if (now - lastKeyPress < DEBOUNCE_TIME) return;
      lastKeyPress = now;
      
      try {
        switch (event.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            event.preventDefault();
            movePlayer(0, -1);
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            event.preventDefault();
            movePlayer(0, 1);
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            event.preventDefault();
            movePlayer(-1, 0);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            event.preventDefault();
            movePlayer(1, 0);
            break;
          case ' ':
            event.preventDefault();
            // Wait/skip turn - throttled
            if (now - lastMoveTimeRef.current > 200) {
              setTurn(prevTurn => prevTurn + 1);
              lastMoveTimeRef.current = now;
            }
            break;
          case 'Tab':
          case 'h':
          case 'H':
            event.preventDefault();
            toggleUI();
            break;
          case 'Escape':
            event.preventDefault();
            setGameState(prev => prev === 'paused' ? 'playing' : 'paused');
            break;
        }
      } catch (error) {
        console.error('Keyboard input error:', error);
      }
    };

    window.addEventListener('keydown', handleKeyPress, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, movePlayer, toggleUI, isMoving]);

  // Handle tile interactions with defensive checks
  const handleTileInteraction = useCallback((x, y) => {
    // Bounds checking
    if (!dungeon || !Array.isArray(dungeon)) {
      console.warn('Invalid dungeon in handleTileInteraction');
      return;
    }
    
    if (y < 0 || y >= dungeon.length || !dungeon[y] || x < 0 || x >= dungeon[y].length) {
      console.warn('Tile interaction out of bounds:', { x, y });
      return;
    }
    
    const tile = dungeon[y][x];
    
    if (tile === 'chest') {
      // Get chest loot based on dungeon level
      const loot = getChestLoot(dungeonLevel);
      let message = 'Opened chest! ';
      
      // Add chance for procedural weapon (50% chance)
      if (Math.random() < 0.5) {
        const proceduralWeapons = generateWeaponLoot(dungeonLevel, 1, dungeonTheme);
        const weapon = proceduralWeapons[0];
        setInventory(prev => ({
          ...prev,
          items: [...prev.items, weapon]
        }));
        message += `Found ${weapon.name}! `;
      }
      
      // Process each piece of loot
      loot.forEach(lootItem => {
        if (lootItem.type === 'gold') {
          setPlayer(prev => ({ ...prev, gold: prev.gold + lootItem.amount }));
          message += `Found ${lootItem.amount} gold! `;
        } else if (lootItem.type === 'item') {
          const item = lootItem.item;
          
          if (item.type === ITEM_TYPES.CONSUMABLE) {
            // Add consumable to inventory
            setInventory(prev => ({
              ...prev,
              items: [...prev.items, item]
            }));
            message += `Found ${item.name}! `;
          } else if (item.type === ITEM_TYPES.WEAPON || item.type === ITEM_TYPES.ARMOR) {
            // Add weapons and armor to inventory instead of auto-equipping
            setInventory(prev => ({
              ...prev,
              items: [...prev.items, item]
            }));
            message += `Found ${item.name}! Added to inventory. `;
          }
        }
      });
      
      setCombatLog(prev => [...prev.slice(-9), { message, turn }]);
      
      // Remove chest from dungeon
      setDungeon(prev => {
        const newDungeon = prev.map(row => [...row]);
        newDungeon[y][x] = 'floor';
        return newDungeon;
      });
    } else if (tile === 'stairs') {
      // Go to next level
      const nextLevel = dungeonLevel + 1;
      setDungeonLevel(nextLevel);
      generateNewDungeon(nextLevel);
      setCombatLog(prev => [...prev.slice(-9), { message: `Descended to level ${nextLevel}`, turn }]);
    }
  }, [dungeon, dungeonLevel, dungeonTheme, turn, generateNewDungeon]);

  // Check for interactions when player moves - optimized with defensive checks
  useEffect(() => {
    if (gameState !== 'playing' || isMoving || combatProcessingRef.current) return;
    if (!dungeon || !Array.isArray(dungeon)) return;
    if (!player || typeof player.y !== 'number' || typeof player.x !== 'number') return;
    if (!dungeon[player.y] || !Array.isArray(dungeon[player.y]) || !dungeon[player.y][player.x]) return;
    
    const currentTile = dungeon[player.y][player.x];
    if (currentTile === 'chest' || currentTile === 'stairs') {
      // Clear any existing interaction timeout
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      
      // Add a small delay to prevent interaction during movement
      const timeoutId = setTimeout(() => {
        try {
          handleTileInteraction(player.x, player.y);
        } catch (error) {
          console.error('Tile interaction error:', error);
        }
      }, 100);
      
      interactionTimeoutRef.current = timeoutId;
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [player.x, player.y, player, gameState, dungeon, handleTileInteraction, isMoving]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    const movementTimeout = movementTimeoutRef.current;
    const enemyTimeout = enemyTurnTimeoutRef.current;
    const interactionTimeout = interactionTimeoutRef.current;
    
    return () => {
      // Clean up all timeouts on component unmount
      if (movementTimeout) clearTimeout(movementTimeout);
      if (enemyTimeout) clearTimeout(enemyTimeout);
      if (interactionTimeout) clearTimeout(interactionTimeout);
      clearBattleTimeouts();
    };
  }, [clearBattleTimeouts]);

  // Reset game function
  const resetGame = useCallback(() => {
    // Clear all timeouts
    if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
    if (enemyTurnTimeoutRef.current) clearTimeout(enemyTurnTimeoutRef.current);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    
    // Reset refs
    combatProcessingRef.current = false;
    lastMoveTimeRef.current = 0;
    
    // Reset state
    setPlayer(initialPlayer);
    setInventory(initialInventory);
    setEnemies([]);
    setGameState('playing');
    setTurn(0);
    setCombatLog([]);
    setDungeonLevel(1);
    setIsMoving(false);
    setLearnedSkills({});
    setSkillCooldowns({});
    setPlayerBuffs({});
    generateNewDungeon(1);
  }, [generateNewDungeon]);

  return (
    <div className="min-h-screen magical-particles text-white overflow-hidden">
      {/* Full-screen game board */}
      <div className="flex items-center justify-center min-h-screen py-20 px-4" style={{ paddingTop: '6rem' }}>
        <div className="relative">
          {/* Dungeon Level Indicator with Theme */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-30" style={{ top: '-2.5rem' }}>
            <div 
              className="fantasy-panel-enhanced rounded-md magical-glow" 
              style={{ 
                padding: '0.4rem 1rem',
                borderColor: dungeonTheme?.colors.accent || '#8b4513'
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="game-title" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                  🏰 LV {dungeonLevel}
                </span>
                {dungeonTheme && (
                  <span 
                    className="fantasy-text" 
                    style={{ 
                      fontSize: '8px', 
                      letterSpacing: '0.08em',
                      color: dungeonTheme.colors.accent,
                      textShadow: `0 0 8px ${dungeonTheme.colors.accent}40`
                    }}
                  >
                    {dungeonTheme.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="game-board shadow-2xl">
            <GameBoard
              dungeon={dungeon}
              player={player}
              enemies={enemies}
              tileSize={TILE_SIZE}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              theme={dungeonTheme}
              exploredTiles={exploredTiles}
            />
          </div>
        </div>
      </div>

      {/* HUD Overlay */}
      <GameHUD
        player={player}
        turn={turn}
        gameState={gameState}
        onToggleMenu={toggleMenu}
        onTogglePause={togglePause}
        onNewGame={resetGame}
      />

      {/* Toggleable Menu Panels */}
      <MenuPanel
        isOpen={openMenus.inventory}
        onClose={() => toggleMenu('inventory')}
        title="Inventory"
        icon={BagIcon}
        position="left"
        width="w-[500px]"
      >
        <Inventory 
          inventory={inventory} 
          player={player}
          onUseItem={handleUseItem}
          onUnequipItem={handleUnequipItem}
          onEquipItem={handleEquipItem}
          onSellItem={handleSellItem}
        />
      </MenuPanel>

      <MenuPanel
        isOpen={openMenus.stats}
        onClose={() => toggleMenu('stats')}
        title="Character Stats"
        icon={Heart}
        position="right"
        width="w-[450px]"
      >
        <PlayerStats player={player} turn={turn} />
      </MenuPanel>

      <MenuPanel
        isOpen={openMenus.log}
        onClose={() => toggleMenu('log')}
        title="Combat Log"
        icon={ScrollText}
        position="bottom"
      >
        <CombatLog messages={combatLog} />
      </MenuPanel>

      <MenuPanel
        isOpen={openMenus.skills}
        onClose={() => toggleMenu('skills')}
        title="Skills & Abilities"
        icon={Sparkles}
        position="right"
        width="w-[550px]"
      >
        <SkillTree
          player={player}
          learnedSkills={learnedSkills}
          skillPoints={player.skillPoints}
          onLearnSkill={handleLearnSkill}
          onUseSkill={handleUseSkill}
          skillCooldowns={skillCooldowns}
        />
      </MenuPanel>

      {/* Tutorial */}
      {showTutorial && (
        <Tutorial
          onClose={() => setShowTutorial(false)}
          isFirstTime={true}
        />
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <GameOverScreen
          player={player}
          dungeonLevel={dungeonLevel}
          turn={turn}
          onRestart={resetGame}
          victory={dungeonLevel >= 10}
        />
      )}

      {/* Battle Overlay */}
      {gameState === 'battle' && (
        <BattleInterface
          player={player}
          enemy={enemies.find(e => e.id === battle.currentEnemyId) || null}
          inventory={inventory}
          playerTurn={battle.playerTurn}
          effects={battleFx}
          onAttack={handleBattleAttack}
          onUseItem={handleBattleUseItem}
          onRun={handleBattleRun}
        />
      )}

      {/* Level Up Notification */}
      {levelUpData && (
        <LevelUpNotification
          levelUpData={levelUpData}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
};

export default Game;