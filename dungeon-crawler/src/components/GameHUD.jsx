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
      <div className="fixed top-2 left-2 right-2 z-40 pointer-events-none">
        <div className="flex justify-between items-start gap-2">
          {/* Quick Stats (always visible) */}
          {showQuickStats && (
            <div className="fantasy-panel-enhanced pointer-events-auto rounded-md pixel-corners magical-glow" 
                 style={{ 
                   minWidth: '220px', 
                   maxWidth: '240px',
                   padding: '0.5rem',
                   fontSize: '10px'
                 }}
                 aria-label="Player quick stats">
              <div className="flex justify-between items-center mb-2">
                <h3 className="fantasy-title" style={{ fontSize: '10px' }}>⚔️ HERO</h3>
                <span className="fantasy-text px-2 py-0.5 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded border border-amber-700" style={{ fontSize: '9px' }}>
                  T:{turn}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded border border-amber-700/30" aria-label="Health">
                  <div className="flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 border border-red-400 rounded" style={{ width: '1.5rem', height: '1.5rem', minWidth: '1.5rem' }}>
                    <Heart className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="fantasy-text opacity-70" style={{ fontSize: '8px' }}>HP</div>
                    <div className="fantasy-text font-bold" style={{ fontSize: '9px' }}>{player.health}/{player.maxHealth}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded border border-amber-700/30" aria-label="Level">
                  <div className="flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-800 border border-yellow-400 rounded" style={{ width: '1.5rem', height: '1.5rem', minWidth: '1.5rem' }}>
                    <Star className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="fantasy-text opacity-70" style={{ fontSize: '8px' }}>LV</div>
                    <div className="fantasy-text font-bold" style={{ fontSize: '9px' }}>{player.level}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded border border-amber-700/30" aria-label="Gold">
                  <div className="flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-800 border border-yellow-400 rounded" style={{ width: '1.5rem', height: '1.5rem', minWidth: '1.5rem' }}>
                    <Coins className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="fantasy-text opacity-70" style={{ fontSize: '8px' }}>Gold</div>
                    <div className="fantasy-text font-bold" style={{ fontSize: '9px' }}>{player.gold}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded border border-amber-700/30" aria-label="Status">
                  <div className="flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800 border border-green-400 rounded" style={{ width: '1.5rem', height: '1.5rem', minWidth: '1.5rem' }}>
                    <ScrollText className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="fantasy-text opacity-70" style={{ fontSize: '8px' }}>OK</div>
                    <div className="fantasy-text font-bold" style={{ fontSize: '9px' }}>✓</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Game Controls */}
          <div className="flex gap-1.5 pointer-events-auto">
            <button
              onClick={onTogglePause}
              className="pixel-btn flex items-center justify-center p-2"
              style={{ minWidth: '2.5rem', fontSize: '10px' }}
              title={gameState === 'paused' ? 'Resume' : 'Pause'}
            >
              {gameState === 'paused' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onNewGame}
              className="pixel-btn flex items-center gap-1 px-2 py-2"
              style={{ fontSize: '10px' }}
            >
              🎮
            </button>
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="fixed bottom-2 left-2 right-2 z-40 pointer-events-none">
        <div className="flex justify-between items-end gap-2">
          {/* Menu Toggle Buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={() => onToggleMenu('inventory')}
              className="pixel-btn p-2 magical-glow"
              title="Toggle Inventory (I)"
            >
              <img 
                src={inventoryBag} 
                alt="Inventory" 
                className="w-5 h-5 pixel-perfect" 
              />
            </button>
            <button
              onClick={() => onToggleMenu('shop')}
              className="pixel-btn p-2 magical-glow"
              title="Toggle Shop (S)"
            >
              <Coins className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleMenu('stats')}
              className="pixel-btn p-2 magical-glow"
              title="Toggle Character Stats (C)"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleMenu('log')}
              className="pixel-btn p-2 magical-glow"
              title="Toggle Combat Log (L)"
            >
              <ScrollText className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Help */}
          <div className="fantasy-panel-enhanced pointer-events-auto rounded-md" style={{ padding: '0.4rem 0.75rem' }}>
            <div className="fantasy-text leading-tight" style={{ fontSize: '9px' }}>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">🎮</span>
                <span>WASD/Arrows • I/S/C/L</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 modal-overlay-enhanced z-50 flex items-center justify-center">
          <div className="fantasy-panel-enhanced rounded-2xl p-12 text-center max-w-lg pixel-corners magical-glow">
            <div className="game-title mb-8">⏸️ PAUSED</div>
            <p className="fantasy-text text-base mb-8 leading-relaxed">
              Your adventure awaits...
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={onTogglePause} className="pixel-btn px-8 py-4 flex items-center gap-3">
                <Play className="w-5 h-5" />
                RESUME
              </button>
              <button onClick={onNewGame} className="pixel-btn px-8 py-4 flex items-center gap-3">
                🎮 NEW GAME
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameHUD;



