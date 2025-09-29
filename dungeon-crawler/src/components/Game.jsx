import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import GameHUD from './GameHUD';
import MenuPanel from './MenuPanel';
import PlayerStats from './PlayerStats';
import Inventory from './Inventory';
import CombatLog from './CombatLog';
import GameOverScreen from './GameOverScreen';
import BattleInterface from './BattleInterface';
import LevelUpNotification from './LevelUpNotification';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateDungeon } from '../utils/DungeonGenerator';
import { createEnemy, getRandomEnemyType } from '../utils/EnemySystem';
import { CombatSystem } from '../utils/CombatSystem';
import { getChestLoot, applyItemStats, removeItemStats, ITEM_TYPES } from '../utils/ItemSystem';
import { Heart, ScrollText, Eye, EyeOff } from 'lucide-react';

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
  direction: 'front'
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
  const [combatLog, setCombatLog] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  
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

  const clearBattleTimeouts = useCallback(() => {
    battleTimeoutsRef.current.forEach(id => clearTimeout(id));
    battleTimeoutsRef.current = [];
  }, []);
  
  // Keep turnRef in sync with turn state
  useEffect(() => {
    turnRef.current = turn;
  }, [turn]);

  // Menu state
  const [openMenus, setOpenMenus] = useState({
    inventory: false,
    stats: false,
    log: false
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

  // Generate a new dungeon level with enemy limit
  const generateNewDungeon = useCallback((level = 1) => {
    try {
      const dungeonData = generateDungeon(BOARD_WIDTH, BOARD_HEIGHT);
      setDungeon(dungeonData.dungeon);
      
      // Create enemies from spawn points - LIMIT TO 5 ENEMIES MAX
      const maxEnemies = Math.min(5, dungeonData.enemySpawns.length);
      const limitedSpawns = dungeonData.enemySpawns.slice(0, maxEnemies);
      
      const newEnemies = limitedSpawns.map((spawn, index) => {
        const enemyType = getRandomEnemyType(level);
        return createEnemy(enemyType, spawn.x, spawn.y, `enemy_${index}`);
      });
      
      setEnemies(newEnemies);
      console.log(`Generated ${newEnemies.length} enemies for level ${level}`);
      
      // Reset player position
      setPlayer(prev => ({
        ...prev,
        x: dungeonData.playerStart.x,
        y: dungeonData.playerStart.y,
        direction: 'front'
      }));
      
      // Add log message directly to avoid circular dependency
      setCombatLog(prev => [...prev.slice(-9), { message: `Entered dungeon level ${level}`, turn: 0 }]);
    } catch (error) {
      console.error('Dungeon generation error:', error);
      // Fallback: create minimal dungeon
      setDungeon(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill('floor')));
      setEnemies([]);
      setPlayer(prev => ({ ...prev, x: 1, y: 1, direction: 'front' }));
    }
  }, []);

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
    // Performance checks
    if (gameState !== 'playing' || isMoving || combatProcessingRef.current) return;
    
    const now = Date.now();
    if (now - lastMoveTimeRef.current < 50) return; // Throttle movement to prevent spam
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
      
      // Check for walls
      if (dungeon[newY] && dungeon[newY][newX] === 'wall') {
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
      
      // Prevent walking onto an enemy's tile
      const enemyOnTarget = enemies.find(e => e.isAlive && e.x === newX && e.y === newY);

      const newPlayer = enemyOnTarget
        ? { ...prevPlayer, direction }
        : { ...prevPlayer, x: newX, y: newY, direction };

      // Trigger encounter if adjacent to enemies
      try {
        const adjacent = CombatSystem.getAdjacentEnemies(newPlayer, enemies);
        if (adjacent && adjacent.length > 0) {
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
  }, [gameState, dungeon, enemies, isMoving]);

  // Battle helpers
  const getCurrentEnemy = useCallback(() => {
    if (!battle.active || !battle.currentEnemyId) return null;
    return enemies.find(e => e.id === battle.currentEnemyId) || null;
  }, [battle.active, battle.currentEnemyId, enemies]);

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
    const enemy = getCurrentEnemy();
    if (!enemy) return;

    // Clone objects for safe updates
    const enemyRef = enemy;
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
      const enemyAttack = CombatSystem.enemyAttackPlayer(enemyRef, playerClone);
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
  }, [battle.active, battle.playerTurn, getCurrentEnemy, player, endBattleIfNeeded, clearBattleTimeouts, pushFloat]);

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
    const enemy = getCurrentEnemy();
    if (!enemy) return;
    setBattle(prev => ({ ...prev, playerTurn: false }));
    const enemyRef = enemy;
    const playerClone = { ...player };
    const counterTimeout = setTimeout(() => {
      const enemyAttack = CombatSystem.enemyAttackPlayer(enemyRef, playerClone);
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
  }, [battle.active, battle.playerTurn, inventory.items, getCurrentEnemy, player, clearBattleTimeouts, pushFloat]);

  // Handle enemy turns - DISABLED FOR STABILITY
  useEffect(() => {
    if (gameState !== 'playing' || turn === 0) return;

    // TEMPORARY: Disable enemy AI to isolate the performance issue
    console.log('Enemy turn skipped for debugging - Turn:', turn);
    // Enemy AI will be re-enabled once stability is confirmed
  }, [turn, gameState]);

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

  // Handle tile interactions
  const handleTileInteraction = useCallback((x, y) => {
    const tile = dungeon[y] && dungeon[y][x];
    
    if (tile === 'chest') {
      // Get chest loot based on dungeon level
      const loot = getChestLoot(dungeonLevel);
      let message = 'Opened chest! ';
      
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
  }, [dungeon, dungeonLevel, turn, generateNewDungeon]);

  // Check for interactions when player moves - optimized
  useEffect(() => {
    if (gameState !== 'playing' || isMoving || combatProcessingRef.current) return;
    if (!dungeon[player.y] || !dungeon[player.y][player.x]) return;
    
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
  }, [player.x, player.y, gameState, dungeon, handleTileInteraction, isMoving]);

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
    generateNewDungeon(1);
  }, [generateNewDungeon]);

  return (
    <div className="min-h-screen magical-particles text-white overflow-hidden">
      {/* Full-screen game board */}
      <div className="flex items-center justify-center min-h-screen py-20 px-4" style={{ paddingTop: '6rem' }}>
        <div className="relative">
          {/* Dungeon Level Indicator */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-30" style={{ top: '-2.5rem' }}>
            <div className="fantasy-panel-enhanced rounded-md magical-glow" style={{ padding: '0.4rem 1rem' }}>
              <span className="game-title" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>
                🏰 LV {dungeonLevel}
              </span>
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