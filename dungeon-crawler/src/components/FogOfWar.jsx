import React, { useEffect, useRef } from 'react';

const FogOfWar = ({ 
  dungeon, 
  player, 
  tileSize, 
  width, 
  height, 
  exploredTiles,
  visionRadius = 4 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Set canvas size with pixel ratio for crisp rendering
    canvas.width = width * tileSize * pixelRatio;
    canvas.height = height * tileSize * pixelRatio;
    canvas.style.width = `${width * tileSize}px`;
    canvas.style.height = `${height * tileSize}px`;
    ctx.scale(pixelRatio, pixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, width * tileSize, height * tileSize);

    // Draw fog for each tile
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileKey = `${x},${y}`;
        const isExplored = exploredTiles.has(tileKey);
        
        // Calculate distance from player
        const dx = x - player.x;
        const dy = y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const tileX = x * tileSize;
        const tileY = y * tileSize;

        if (!isExplored) {
          // Unexplored: Complete darkness
          ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
          ctx.fillRect(tileX, tileY, tileSize, tileSize);
        } else if (distance > visionRadius) {
          // Explored but out of vision: Dimmed with fog
          const fogIntensity = Math.min(0.7, 0.4 + (distance - visionRadius) * 0.1);
          ctx.fillStyle = `rgba(0, 0, 0, ${fogIntensity})`;
          ctx.fillRect(tileX, tileY, tileSize, tileSize);
        } else if (distance > visionRadius - 1) {
          // Edge of vision: Slight fade
          const fadeAmount = (distance - (visionRadius - 1)) * 0.3;
          ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
          ctx.fillRect(tileX, tileY, tileSize, tileSize);
        }
        // Tiles within full vision (distance <= visionRadius - 1) have no fog
      }
    }

    // Optional: Add vignette effect at vision edges
    const gradient = ctx.createRadialGradient(
      player.x * tileSize + tileSize / 2,
      player.y * tileSize + tileSize / 2,
      visionRadius * tileSize * 0.6,
      player.x * tileSize + tileSize / 2,
      player.y * tileSize + tileSize / 2,
      visionRadius * tileSize * 1.2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width * tileSize, height * tileSize);

  }, [dungeon, player, exploredTiles, visionRadius, width, height, tileSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
        imageRendering: 'pixelated'
      }}
    />
  );
};

export default FogOfWar;

