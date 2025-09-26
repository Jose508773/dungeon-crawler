import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Star, 
  Coins, 
  ScrollText, 
  Settings,
  X,
  Pause,
  Play
} from 'lucide-react';

// Import bag icon
import inventoryBag from '../assets/sprites/ui/inventory_bag.png';

const GameHUD = ({ 
  player, 
  turn, 
  gameState, 
  onToggleMenu, 
  onTogglePause, 
  onNewGame,
  showQuickStats = true 
}) => {
  return (
    <>
      {/* Top HUD Bar */}
      <div className="fixed top-4 left-4 right-4 z-40 pointer-events-none">
        <div className="flex justify-between items-start">
          {/* Quick Stats (always visible) */}
          {showQuickStats && (
            <div className="fantasy-panel pointer-events-auto p-4 rounded-lg" aria-label="Player quick stats">
              <div className="flex justify-between items-center mb-3">
                <h3 className="fantasy-title text-lg">⚔️ Adventurer</h3>
                <span className="fantasy-text text-sm">Turn {turn}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2" aria-label="Health">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center border-2 border-red-400">
                    <Heart className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="fantasy-text text-xs">Health</div>
                    <div className="fantasy-text text-sm font-bold">{player.health}/{player.maxHealth}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2" aria-label="Level">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded flex items-center justify-center border-2 border-yellow-400">
                    <Star className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="fantasy-text text-xs">Level</div>
                    <div className="fantasy-text text-sm font-bold">{player.level}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2" aria-label="Gold">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded flex items-center justify-center border-2 border-yellow-400">
                    <Coins className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="fantasy-text text-xs">Gold</div>
                    <div className="fantasy-text text-sm font-bold">{player.gold}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2" aria-label="Status">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded flex items-center justify-center border-2 border-purple-400">
                    <ScrollText className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="fantasy-text text-xs">Status</div>
                    <div className="fantasy-text text-sm font-bold">Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Game Controls */}
          <div className="flex gap-2 pointer-events-auto">
            <Button
              onClick={onTogglePause}
              size="sm"
              className="fantasy-button px-4 py-2 rounded-lg"
            >
              {gameState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onNewGame}
              size="sm"
              className="fantasy-button px-4 py-2 rounded-lg"
            >
              🎮 New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 pointer-events-none">
        <div className="flex justify-between items-end">
          {/* Menu Toggle Buttons */}
          <div className="flex gap-3 pointer-events-auto">
            <Button
              onClick={() => onToggleMenu('inventory')}
              size="default"
              className="fantasy-button p-3 rounded-lg magical-glow"
              title="Toggle Inventory (I)"
            >
              <img 
                src={inventoryBag} 
                alt="Inventory" 
                className="w-6 h-6" 
                style={{ imageRendering: 'pixelated' }}
              />
            </Button>
            <Button
              onClick={() => onToggleMenu('stats')}
              size="default"
              className="fantasy-button p-3 rounded-lg magical-glow"
              title="Toggle Character Stats (C)"
            >
              <Heart className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => onToggleMenu('log')}
              size="default"
              className="fantasy-button p-3 rounded-lg magical-glow"
              title="Toggle Combat Log (L)"
            >
              <ScrollText className="w-6 h-6" />
            </Button>
          </div>

          {/* Controls Help */}
          <div className="fantasy-card pointer-events-auto p-3">
            <div className="fantasy-text text-xs space-y-1">
              <div>🎮 WASD/Arrows: Move • Space: Wait</div>
              <div>⚔️ I: Inventory • C: Stats • L: Combat Log</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 fantasy-modal-overlay z-50 flex items-center justify-center">
          <div className="fantasy-card p-8 text-center max-w-md">
            <div className="fantasy-title text-3xl mb-4">⏸️ Game Paused</div>
            <p className="fantasy-text mb-6">Press Resume to continue your adventure</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onTogglePause} className="fantasy-button px-6 py-3">
                <Play className="w-4 h-4 mr-2" />
                ▶️ Resume
              </Button>
              <Button onClick={onNewGame} className="fantasy-button px-6 py-3">
                🎮 New Game
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameHUD;



