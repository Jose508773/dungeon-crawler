import React from 'react';
import FogOfWar from './FogOfWar';

// Import sprites
import stoneWall from '../assets/sprites/environment/stone_wall.png';
import stoneFloor from '../assets/sprites/environment/stone_floor.png';
import doorClosed from '../assets/sprites/environment/wooden_door_closed.png';
import stairsDown from '../assets/sprites/environment/stairs_down.png';
import chestClosed from '../assets/sprites/environment/treasure_chest_closed.png';
import torchLit from '../assets/sprites/environment/torch_lit.png';

import playerFront from '../assets/sprites/characters/player_front.png';
import playerBack from '../assets/sprites/characters/player_back.png';
import playerLeft from '../assets/sprites/characters/player_left.png';
import playerRight from '../assets/sprites/characters/player_right.png';

// Tile sprite mapping
const TILE_SPRITES = {
  wall: stoneWall,
  floor: stoneFloor,
  door: doorClosed,
  stairs: stairsDown,
  chest: chestClosed,
  torch: torchLit
};

// Player sprite mapping
const PLAYER_SPRITES = {
  front: playerFront,
  back: playerBack,
  left: playerLeft,
  right: playerRight
};

const GameBoard = ({ dungeon, player, enemies, tileSize, width, height, theme, exploredTiles }) => {
  // Defensive checks to prevent crashes
  if (!dungeon || !Array.isArray(dungeon) || dungeon.length === 0) {
    return <div className="text-white p-4">Loading dungeon...</div>;
  }
  
  if (!player || typeof player.x !== 'number' || typeof player.y !== 'number') {
    return <div className="text-white p-4">Loading player...</div>;
  }
  
  // Get theme colors or use defaults
  const themeColors = theme?.colors || {
    floor: '#4a4a4a',
    wall: '#2a2a2a',
    accent: '#8b4513',
    fog: 'rgba(20, 20, 30, 0.3)'
  };
  
  const effectColor = theme?.effectColor || themeColors.accent;
  
  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
    gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
    gap: '0px',
    border: '6px solid transparent',
    borderImage: `repeating-linear-gradient(90deg, ${themeColors.accent} 0px, ${themeColors.accent} 8px, ${themeColors.wall} 8px, ${themeColors.wall} 16px) 6`,
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: themeColors.wall,
    boxShadow: `
      0 0 40px ${effectColor}80,
      0 0 80px ${effectColor}40,
      inset 0 0 30px rgba(0, 0, 0, 0.9),
      0 12px 32px rgba(0, 0, 0, 0.8)
    `,
    background: `
      radial-gradient(ellipse at 20% 20%, ${effectColor}26 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, ${effectColor}26 0%, transparent 50%),
      linear-gradient(145deg, ${themeColors.wall} 0%, ${themeColors.floor} 100%)
    `
  };

  // Get theme-specific tile filter
  const getTileFilter = (tileType) => {
    if (!theme) return 'none';
    
    const themeFilters = {
      ice_cave: {
        wall: 'brightness(1.1) saturate(1.3) hue-rotate(180deg)',
        floor: 'brightness(1.2) saturate(1.2) hue-rotate(180deg)',
        default: 'brightness(1.15) saturate(1.2) hue-rotate(180deg)'
      },
      lava_pit: {
        wall: 'brightness(0.8) saturate(1.5) hue-rotate(-30deg) contrast(1.2)',
        floor: 'brightness(0.9) saturate(1.6) hue-rotate(-30deg) contrast(1.1)',
        default: 'brightness(0.85) saturate(1.5) hue-rotate(-30deg)'
      },
      shadow_crypt: {
        wall: 'brightness(0.6) saturate(0.8) hue-rotate(240deg) contrast(1.3)',
        floor: 'brightness(0.7) saturate(0.9) hue-rotate(240deg)',
        default: 'brightness(0.65) saturate(0.85) hue-rotate(240deg)'
      },
      cursed_forest: {
        wall: 'brightness(0.8) saturate(1.4) hue-rotate(90deg) contrast(1.1)',
        floor: 'brightness(0.9) saturate(1.3) hue-rotate(90deg)',
        default: 'brightness(0.85) saturate(1.35) hue-rotate(90deg)'
      },
      stone_dungeon: {
        wall: 'none',
        floor: 'none',
        default: 'none'
      }
    };
    
    const filters = themeFilters[theme.id] || themeFilters.stone_dungeon;
    return filters[tileType] || filters.default;
  };
  
  const tileStyle = {
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    imageRendering: 'pixelated',
    display: 'block'
  };

  const playerStyle = {
    position: 'absolute',
    left: `${player.x * tileSize}px`,
    top: `${player.y * tileSize}px`,
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    imageRendering: 'pixelated',
    zIndex: 10,
    transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), top 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: `
      drop-shadow(0 0 16px rgba(255, 140, 66, 0.9))
      drop-shadow(0 0 32px rgba(255, 215, 0, 0.5))
      drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))
    `,
    animation: 'playerGlow 2s ease-in-out infinite alternate'
  };

  // Generate torch positions based on dungeon layout
  const getTorchPositions = () => {
    const torches = [];
    
    // Add torches near walls for atmospheric lighting
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (dungeon[y] && dungeon[y][x] === 'wall') {
          // Check if there's a floor tile adjacent (good spot for torch)
          const adjacentFloors = [
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }
          ].some(dir => {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            return dungeon[ny] && dungeon[ny][nx] === 'floor';
          });
          
          // Randomly place torches on walls adjacent to floors
          if (adjacentFloors && Math.random() < 0.15) {
            torches.push({ x, y });
          }
        }
      }
    }
    
    return torches;
  };

  const torchPositions = getTorchPositions();

  return (
    <div className="flex justify-center pixel-corners">
      <div style={boardStyle} className="pixel-perfect">
        {/* Render dungeon tiles */}
        {dungeon.map((row, y) =>
          row.map((tile, x) => {
            const sprite = TILE_SPRITES[tile] || TILE_SPRITES.floor;
            const filter = getTileFilter(tile);
            return (
              <img
                key={`${x}-${y}`}
                src={sprite}
                alt={tile}
                style={{
                  ...tileStyle,
                  filter: filter
                }}
                draggable={false}
                className="pixel-perfect"
              />
            );
          })
        )}
        
        {/* Render atmospheric torches */}
        {torchPositions.map((torch, index) => {
          // Theme-specific torch glow colors
          const getTorchGlow = () => {
            if (!theme) return 'rgba(255, 140, 66, 0.9)';
            
            const torchGlows = {
              ice_cave: 'rgba(136, 192, 208, 0.9)',      // Cyan glow
              lava_pit: 'rgba(255, 69, 0, 1.0)',         // Orange-red glow
              shadow_crypt: 'rgba(138, 43, 226, 0.9)',   // Purple glow
              cursed_forest: 'rgba(118, 255, 3, 0.8)',   // Green glow
              stone_dungeon: 'rgba(255, 140, 66, 0.9)'   // Default orange
            };
            
            return torchGlows[theme.id] || torchGlows.stone_dungeon;
          };
          
          const torchGlow = getTorchGlow();
          
          return (
            <img
              key={`torch-${index}`}
              src={torchLit}
              alt="torch"
              style={{
                position: 'absolute',
                left: `${torch.x * tileSize}px`,
                top: `${torch.y * tileSize}px`,
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                imageRendering: 'pixelated',
                zIndex: 5,
                filter: `${getTileFilter('default')} drop-shadow(0 0 16px ${torchGlow}) drop-shadow(0 0 32px ${torchGlow.replace('0.9', '0.4')})`,
                animation: 'flicker 2s infinite alternate'
              }}
              draggable={false}
              className="pixel-perfect"
            />
          );
        })}
        
        {/* Render enemies */}
        {Array.isArray(enemies) && enemies.filter(e => e && typeof e.x === 'number' && typeof e.y === 'number' && e.sprite).map((enemy) => (
          <div
            key={`enemy-${enemy.id}`}
            style={{
              position: 'absolute',
              left: `${enemy.x * tileSize}px`,
              top: `${enemy.y * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              zIndex: 9,
              transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1), top 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <img
              src={enemy.sprite}
              alt={enemy.name || 'enemy'}
              className="pixel-perfect"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
                filter: (enemy.health || 0) < (enemy.maxHealth || 1) * 0.3 
                  ? 'drop-shadow(0 0 12px rgba(255, 0, 0, 0.9)) drop-shadow(0 0 24px rgba(255, 0, 0, 0.5)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))' 
                  : 'drop-shadow(0 0 8px rgba(255, 50, 50, 0.5)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))'
              }}
              draggable={false}
            />
            
            {/* Enemy health bar */}
            {(enemy.health || 0) < (enemy.maxHealth || 1) && (
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '4px',
                  width: `${tileSize - 8}px`,
                  height: '6px',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: '2px solid #8b4513',
                  borderRadius: '3px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100, ((enemy.health || 0) / (enemy.maxHealth || 1)) * 100))}%`,
                    height: '100%',
                    background: (enemy.health || 0) > (enemy.maxHealth || 1) * 0.5 
                      ? 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)' 
                      : (enemy.health || 0) > (enemy.maxHealth || 1) * 0.25 
                        ? 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)' 
                        : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '2px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                  }}
                />
              </div>
            )}
          </div>
        ))}
        
        {/* Render player */}
        <img
          src={PLAYER_SPRITES[player.direction]}
          alt="player"
          style={playerStyle}
          draggable={false}
          className="pixel-perfect"
        />
        
        {/* Theme Fog Overlay */}
        {theme && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: themeColors.fog,
              pointerEvents: 'none',
              zIndex: 20,
              mixBlendMode: 'multiply',
              opacity: 0.6
            }}
            className="theme-fog"
          />
        )}
        
        {/* Fog of War Overlay */}
        <FogOfWar
          dungeon={dungeon}
          player={player}
          tileSize={tileSize}
          width={width}
          height={height}
          exploredTiles={exploredTiles}
          visionRadius={4}
        />
        
        {/* Add CSS for torch flicker animation */}
        <style jsx>{`
          @keyframes flicker {
            0% { filter: drop-shadow(0 0 12px rgba(255, 140, 66, 0.8)) brightness(1); }
            25% { filter: drop-shadow(0 0 16px rgba(255, 140, 66, 0.9)) brightness(1.1); }
            50% { filter: drop-shadow(0 0 10px rgba(255, 140, 66, 0.7)) brightness(0.9); }
            75% { filter: drop-shadow(0 0 14px rgba(255, 140, 66, 0.85)) brightness(1.05); }
            100% { filter: drop-shadow(0 0 12px rgba(255, 140, 66, 0.8)) brightness(1); }
          }
          
          .theme-fog {
            animation: fogPulse 8s ease-in-out infinite alternate;
          }
          
          @keyframes fogPulse {
            0% { opacity: 0.5; }
            100% { opacity: 0.7; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GameBoard;

