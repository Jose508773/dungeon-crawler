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
            <Card className="bg-black/70 border-orange-500/30 backdrop-blur-sm pointer-events-auto">
              <CardContent className="p-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-red-400">
                    <Heart className="w-4 h-4" />
                    <span>{player.health}/{player.maxHealth}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Star className="w-4 h-4" />
                    <span>Lv.{player.level}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Coins className="w-4 h-4" />
                    <span>{player.gold}</span>
                  </div>
                  <div className="text-gray-400">
                    Turn {turn}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Game Controls */}
          <div className="flex gap-2 pointer-events-auto">
            <Button
              onClick={onTogglePause}
              size="sm"
              variant="outline"
              className="bg-black/70 border-orange-500/30 hover:bg-orange-500/20 backdrop-blur-sm"
            >
              {gameState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onNewGame}
              size="sm"
              variant="outline"
              className="bg-black/70 border-orange-500/30 hover:bg-orange-500/20 backdrop-blur-sm"
            >
              New Game
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
              variant="outline"
              className="bg-black/70 border-orange-500/30 hover:bg-orange-500/20 backdrop-blur-sm px-4 py-3"
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
              variant="outline"
              className="bg-black/70 border-orange-500/30 hover:bg-orange-500/20 backdrop-blur-sm px-4 py-3"
              title="Toggle Character Stats (C)"
            >
              <Heart className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => onToggleMenu('log')}
              size="default"
              variant="outline"
              className="bg-black/70 border-orange-500/30 hover:bg-orange-500/20 backdrop-blur-sm px-4 py-3"
              title="Toggle Combat Log (L)"
            >
              <ScrollText className="w-6 h-6" />
            </Button>
          </div>

          {/* Controls Help */}
          <Card className="bg-black/70 border-orange-500/30 backdrop-blur-sm pointer-events-auto">
            <CardContent className="p-2">
              <div className="text-xs text-gray-300 space-y-1">
                <div>WASD/Arrows: Move • Space: Wait</div>
                <div>I: Inventory • C: Stats • L: Combat Log</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <Pause className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-orange-400 mb-2">Game Paused</h2>
              <p className="text-gray-300 mb-6">Press Resume to continue your adventure</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={onTogglePause} className="bg-orange-600 hover:bg-orange-700">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button onClick={onNewGame} variant="outline">
                  New Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default GameHUD;

