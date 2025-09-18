import React, { useState, useEffect, useCallback } from 'react';
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
import { Heart, Package, ScrollText, Eye, EyeOff } from 'lucide-react';

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

  // Add message to combat log
  const addCombatMessage = useCallback((message) => {
    setCombatLog(prev => [...prev.slice(-9), { message, turn }]);
  }, [turn]);

  // Handle item usage
  const handleUseItem = useCallback((item, index) => {
    if (item.type === 'consumable') {
      if (item.health) {
        setPlayer(prev => {
          const newHealth = Math.min(prev.maxHealth, prev.health + item.health);
          return { ...prev, health: newHealth };
        });
        addCombatMessage(`Used ${item.name}! Restored ${item.health} health.`);
      }
      
      // Remove item from inventory
      setInventory(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  }, [addCombatMessage]);

  // Handle unequipping items
  const handleUnequipItem = useCallback((itemType) => {
    if (itemType === 'weapon' && inventory.weapon) {
      const weaponName = inventory.weapon.name;
      setPlayer(prev => removeItemStats({ ...prev }, inventory.weapon));
      setInventory(prev => ({ ...prev, weapon: null }));
      addCombatMessage(`Unequipped ${weaponName}`);
    } else if (itemType === 'armor' && inventory.armor) {
      const armorName = inventory.armor.name;
      setPlayer(prev => removeItemStats({ ...prev }, inventory.armor));
      setInventory(prev => ({ ...prev, armor: null }));
      addCombatMessage(`Unequipped ${armorName}`);
    }
  }, [inventory.weapon, inventory.armor, addCombatMessage]);

  // Generate a new dungeon level
  const generateNewDungeon = useCallback((level = 1) => {
    const dungeonData = generateDungeon(BOARD_WIDTH, BOARD_HEIGHT);
    setDungeon(dungeonData.dungeon);
    
    // Create enemies from spawn points
    const newEnemies = dungeonData.enemySpawns.map((spawn, index) => {
      const enemyType = getRandomEnemyType(level);
      return createEnemy(enemyType, spawn.x, spawn.y, `enemy_${index}`);
    });
    
    setEnemies(newEnemies);
    
    // Reset player position
    setPlayer(prev => ({
      ...prev,
      x: dungeonData.playerStart.x,
      y: dungeonData.playerStart.y,
      direction: 'front'
    }));
    
    // Add log message directly to avoid circular dependency
    setCombatLog(prev => [...prev.slice(-9), { message: `Entered dungeon level ${level}`, turn: 0 }]);
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

  // Handle player movement
  const movePlayer = useCallback((dx, dy) => {
    if (gameState !== 'playing' || isMoving) return;
    
    setIsMoving(true);

    setPlayer(prevPlayer => {
      const newX = prevPlayer.x + dx;
      const newY = prevPlayer.y + dy;
      
      // Check bounds
      if (newX < 0 || newX >= BOARD_WIDTH || newY < 0 || newY >= BOARD_HEIGHT) {
        setIsMoving(false);
        return prevPlayer;
      }
      
      // Check for walls
      if (dungeon[newY] && dungeon[newY][newX] === 'wall') {
        setIsMoving(false);
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

      // Handle combat when moving - use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        const combatResults = CombatSystem.handleAutoCombat(newPlayer, enemies);
        
        if (combatResults.length > 0) {
          // Update enemies after combat
          setEnemies(prevEnemies => prevEnemies.filter(enemy => enemy.isAlive));
          
          // Apply rewards and update player
          const rewards = CombatSystem.applyRewards(newPlayer, combatResults);
          
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
              addCombatMessage('Game Over! You have been defeated.');
            }
            
            return updatedPlayer;
          });
          
          // Add combat messages
          combatResults.forEach(result => addCombatMessage(result.message));
          
          if (rewards.experience > 0) {
            addCombatMessage(`Gained ${rewards.experience} XP and ${rewards.gold} gold!`);
          }
          
          if (rewards.levelUp.leveledUp) {
            addCombatMessage(rewards.levelUp.message);
          }
        }
        
        // Re-enable movement after combat processing
        setIsMoving(false);
      });
      
      return newPlayer;
    });
    
    // Increment turn counter
    setTurn(prevTurn => prevTurn + 1);
  }, [gameState, dungeon, enemies, isMoving, addCombatMessage]);

  // Handle enemy turns
  useEffect(() => {
    if (gameState !== 'playing' || turn === 0) return;

    const enemyTurnTimer = setTimeout(() => {
      setEnemies(prevEnemies => {
        const newEnemies = [...prevEnemies];
        
        // Move each enemy
        newEnemies.forEach(enemy => {
          const move = enemy.getNextMove(dungeon, newEnemies, player, turn);
          if (move) {
            enemy.x = move.x;
            enemy.y = move.y;
          }
        });
        
        // Handle enemy attacks
        const combatResults = CombatSystem.handleEnemyTurnCombat(newEnemies, player);
        
        if (combatResults.length > 0) {
          combatResults.forEach(result => addCombatMessage(result.message));
          
          // Update player health and check for game over in one operation
          setPlayer(prev => {
            const updatedPlayer = { ...prev };
            let totalDamage = 0;
            
            combatResults.forEach(result => {
              if (result.damage) {
                totalDamage += result.damage;
              }
            });
            
            updatedPlayer.health = Math.max(0, updatedPlayer.health - totalDamage);
            
            // Check for game over
            if (updatedPlayer.health <= 0) {
              setGameState('gameOver');
              addCombatMessage('Game Over! You have been defeated.');
            }
            
            return updatedPlayer;
          });
        }
        
        return newEnemies;
      });
    }, 500); // Delay enemy turns slightly for better UX

    return () => clearTimeout(enemyTurnTimer);
  }, [turn, gameState, dungeon, player, addCombatMessage]);

  // Handle keyboard input with debouncing
  useEffect(() => {
    let lastKeyPress = 0;
    const DEBOUNCE_TIME = 100; // 100ms debounce
    
    const handleKeyPress = (event) => {
      if (gameState !== 'playing') return;
      
      const now = Date.now();
      if (now - lastKeyPress < DEBOUNCE_TIME) return;
      lastKeyPress = now;
      
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
          // Wait/skip turn
          setTurn(prevTurn => prevTurn + 1);
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
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, movePlayer, toggleUI]);

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

  // Check for interactions when player moves
  useEffect(() => {
    if (gameState !== 'playing' || isMoving) return;
    if (dungeon[player.y] && dungeon[player.y][player.x]) {
      const currentTile = dungeon[player.y][player.x];
      if (currentTile === 'chest' || currentTile === 'stairs') {
        // Add a small delay to prevent interaction during movement
        const interactionTimer = setTimeout(() => {
          handleTileInteraction(player.x, player.y);
        }, 50);
        
        return () => clearTimeout(interactionTimer);
      }
    }
  }, [player.x, player.y, gameState, dungeon, handleTileInteraction, isMoving]);

  // Reset game function
  const resetGame = useCallback(() => {
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
        icon={Package}
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

