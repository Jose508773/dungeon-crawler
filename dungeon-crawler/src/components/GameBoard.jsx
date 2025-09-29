import React from 'react';

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

const GameBoard = ({ dungeon, player, enemies, tileSize, width, height }) => {
  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
    gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
    gap: '0px',
    border: '6px solid transparent',
    borderImage: 'repeating-linear-gradient(90deg, #8b4513 0px, #8b4513 8px, #cd853f 8px, #cd853f 16px) 6',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0f0a1a',
    boxShadow: `
      0 0 40px rgba(255, 140, 66, 0.5),
      0 0 80px rgba(139, 69, 19, 0.3),
      inset 0 0 30px rgba(0, 0, 0, 0.9),
      0 12px 32px rgba(0, 0, 0, 0.8)
    `,
    background: `
      radial-gradient(ellipse at 20% 20%, rgba(139, 69, 19, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(75, 0, 130, 0.15) 0%, transparent 50%),
      linear-gradient(145deg, #1a0d2e 0%, #0f0a1a 100%)
    `
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
            return (
              <img
                key={`${x}-${y}`}
                src={sprite}
                alt={tile}
                style={tileStyle}
                draggable={false}
                className="pixel-perfect"
              />
            );
          })
        )}
        
        {/* Render atmospheric torches */}
        {torchPositions.map((torch, index) => (
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
              filter: 'drop-shadow(0 0 16px rgba(255, 140, 66, 0.9)) drop-shadow(0 0 32px rgba(255, 140, 66, 0.4))',
              animation: 'flicker 2s infinite alternate'
            }}
            draggable={false}
            className="pixel-perfect"
          />
        ))}
        
        {/* Render enemies */}
        {enemies.map((enemy) => (
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
              alt={enemy.name}
              className="pixel-perfect"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
                filter: enemy.health < enemy.maxHealth * 0.3 
                  ? 'drop-shadow(0 0 12px rgba(255, 0, 0, 0.9)) drop-shadow(0 0 24px rgba(255, 0, 0, 0.5)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))' 
                  : 'drop-shadow(0 0 8px rgba(255, 50, 50, 0.5)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))'
              }}
              draggable={false}
            />
            
            {/* Enemy health bar */}
            {enemy.health < enemy.maxHealth && (
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
                    width: `${(enemy.health / enemy.maxHealth) * 100}%`,
                    height: '100%',
                    background: enemy.health > enemy.maxHealth * 0.5 
                      ? 'linear-gradient(90deg, #4ade80 0%, #22c55e 100%)' 
                      : enemy.health > enemy.maxHealth * 0.25 
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
        
        {/* Add CSS for torch flicker animation */}
        <style jsx>{`
          @keyframes flicker {
            0% { filter: drop-shadow(0 0 12px rgba(255, 140, 66, 0.8)) brightness(1); }
            25% { filter: drop-shadow(0 0 16px rgba(255, 140, 66, 0.9)) brightness(1.1); }
            50% { filter: drop-shadow(0 0 10px rgba(255, 140, 66, 0.7)) brightness(0.9); }
            75% { filter: drop-shadow(0 0 14px rgba(255, 140, 66, 0.85)) brightness(1.05); }
            100% { filter: drop-shadow(0 0 12px rgba(255, 140, 66, 0.8)) brightness(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default GameBoard;

