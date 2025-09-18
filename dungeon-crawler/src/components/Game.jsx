import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from './GameBoard';
import GameHUD from './GameHUD';
import MenuPanel from './MenuPanel';
import PlayerStats from './PlayerStats';
import Inventory from './Inventory';
import CombatLog from './CombatLog';
import GameOverScreen from './GameOverScreen';
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
  const [gameState, setGameState] = useState('playing'); // 'playing', 'paused', 'gameOver'
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
      
      const newPlayer = {
        ...prevPlayer,
        x: newX,
        y: newY,
        direction
      };

      // Handle combat when moving - optimized with batched updates
      try {
        const combatResults = CombatSystem.handleAutoCombat(newPlayer, enemies);
        
        if (combatResults && combatResults.length > 0) {
          // Batch all state updates to prevent multiple re-renders
          const rewards = CombatSystem.applyRewards(newPlayer, combatResults);
          
          // Single batched update for better performance
          setEnemies(prevEnemies => prevEnemies.filter(enemy => enemy.isAlive));
          
          setPlayer(prev => {
            const updatedPlayer = {
              ...prev,
              experience: newPlayer.experience,
              gold: newPlayer.gold,
              health: newPlayer.health,
              level: newPlayer.level,
              maxHealth: newPlayer.maxHealth,
              attack: newPlayer.attack,
              defense: newPlayer.defense
            };
            
            // Check for game over
            if (updatedPlayer.health <= 0) {
              setGameState('gameOver');
              setCombatLog(prev => [...prev.slice(-9), { message: 'Game Over! You have been defeated.', turn: turnRef.current + 1 }]);
            }
            
            return updatedPlayer;
          });
          
          // Batch combat messages to prevent excessive re-renders
          const messages = [];
          combatResults.forEach(result => {
            if (result && result.message) messages.push(result.message);
          });
          
          if (rewards && rewards.experience > 0) {
            messages.push(`Gained ${rewards.experience} XP and ${rewards.gold} gold!`);
          }
          
          if (rewards && rewards.levelUp && rewards.levelUp.leveledUp) {
            messages.push(rewards.levelUp.message);
          }
          
          // Add all messages at once
          if (messages.length > 0) {
            setCombatLog(prev => {
              const newMessages = messages.map((message, index) => ({ 
                message, 
                turn: turnRef.current + 1 + index
              }));
              return [...prev.slice(-(10 - newMessages.length)), ...newMessages];
            });
          }
        }
      } catch (error) {
        console.error('Combat processing error:', error);
        // Reset game state on critical error
        setGameState('paused');
      } finally {
        // Always re-enable movement, even if there's an error
        if (movementTimeoutRef.current) clearTimeout(movementTimeoutRef.current);
        setIsMoving(false);
        combatProcessingRef.current = false;
      }
      
      return newPlayer;
    });
    
    // Increment turn counter
    setTurn(prevTurn => prevTurn + 1);
  }, [gameState, dungeon, enemies, isMoving]);

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
            // Check if player wants to equip the item
            const currentItem = item.type === ITEM_TYPES.WEAPON ? inventory.weapon : inventory.armor;
            
            if (currentItem) {
              // Remove stats from current item
              setPlayer(prev => removeItemStats({ ...prev }, currentItem));
            }
            
            // Equip new item
            if (item.type === ITEM_TYPES.WEAPON) {
              setInventory(prev => ({ ...prev, weapon: item }));
            } else {
              setInventory(prev => ({ ...prev, armor: item }));
            }
            
            // Apply new item stats
            setPlayer(prev => applyItemStats({ ...prev }, item));
            message += `Equipped ${item.name}! `;
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
  }, [dungeon, dungeonLevel, inventory, turn, generateNewDungeon]);

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
    };
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Full-screen game board */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative">
          {/* Dungeon Level Indicator */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-orange-500/30">
              <span className="text-lg font-semibold text-orange-300">
                Dungeon Level {dungeonLevel}
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
      >
        <Inventory 
          inventory={inventory} 
          player={player}
          onUseItem={handleUseItem}
          onUnequipItem={handleUnequipItem}
        />
      </MenuPanel>

      <MenuPanel
        isOpen={openMenus.stats}
        onClose={() => toggleMenu('stats')}
        title="Character Stats"
        icon={Heart}
        position="right"
      >
        <PlayerStats player={player} turn={turn} />
      </MenuPanel>

      <MenuPanel
        isOpen={openMenus.log}
        onClose={() => toggleMenu('log')}
        title="Combat Log"
        icon={ScrollText}
        position="bottom"
        width="w-full"
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
    </div>
  );
};

export default Game;