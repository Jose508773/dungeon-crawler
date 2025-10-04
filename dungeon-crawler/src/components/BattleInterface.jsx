import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import playerFront from '../assets/sprites/characters/player_front.png';
import ironSword from '../assets/sprites/items/iron_sword.png';

const Bar = ({ label, current, max, color = '#22c55e', testId }) => {
  const pct = Math.max(0, Math.min(100, Math.round((current / max) * 100)));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span data-testid={testId} style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '0.06em' }}>{label}</span>
      <div style={{ flex: 1, height: '10px', background: 'linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.35))', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', boxShadow: pct < 100 ? '0 0 10px rgba(239,68,68,0.25) inset' : 'none' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 200ms ease, filter 120ms ease', filter: pct < 100 ? 'brightness(1.05)' : 'none' }} />
      </div>
      <span style={{ fontWeight: 600, fontSize: '12px' }}>{current}/{max}</span>
    </div>
  );
};

const BattleInterface = ({ player, enemy, onAttack, onRun, onUseItem, inventory, playerTurn, effects }) => {
  // Defensive checks to prevent crashes
  if (!enemy || !player) {
    console.warn('BattleInterface: Missing enemy or player data');
    return null;
  }
  
  // Validate required enemy properties
  if (!enemy.name || typeof enemy.health !== 'number' || typeof enemy.maxHealth !== 'number') {
    console.error('BattleInterface: Invalid enemy state', enemy);
    return null;
  }

  const hasConsumable = Array.isArray(inventory?.items) && inventory.items.some(i => i && i.type === 'consumable');

  return (
    <div className="fixed inset-0 modal-overlay-enhanced z-50 flex items-center justify-center p-8">
      {/* Fantasy battle frame */}
      <div className="fantasy-panel-enhanced rounded-2xl magical-glow max-w-6xl w-full pixel-corners">
        <div className="relative">
          <div className="grid grid-cols-2 gap-12 p-8 relative">
            {/* Floating damage numbers */}
            {(effects?.floats || []).map(f => (
              <div key={f.id} className="absolute text-3xl font-bold animate-bounce"
                style={{
                  left: f.side === 'enemy' ? '25%' : '75%',
                  top: '35%',
                  transform: 'translate(-50%, -50%)',
                  color: f.color,
                  textShadow: '2px 2px 0 rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.9)',
                  animation: 'floatUp 0.8s ease forwards',
                  fontFamily: '"Press Start 2P", monospace',
                  letterSpacing: '0.1em'
                }}>{f.text}</div>
            ))}
            
            {/* Enemy Panel */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="fantasy-title text-lg">👹 {enemy.name.toUpperCase()}</h3>
                <span className="fantasy-text text-xs px-3 py-1 bg-red-900/40 rounded border border-red-700">
                  Lv ?
                </span>
              </div>
              <div className="health-bar-container">
                <div 
                  className="health-bar-fill"
                  style={{ width: `${Math.max(0, (enemy.health / enemy.maxHealth) * 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="fantasy-text text-xs font-bold" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.9)' }}>
                    {enemy.health}/{enemy.maxHealth}
                  </span>
                </div>
              </div>
              <div className="h-56 flex items-center justify-center bg-gradient-to-b from-red-950/20 to-transparent rounded-lg border-2 border-red-900/30">
                {enemy.sprite ? (
                  <img
                    src={enemy.sprite}
                    alt={enemy.name || 'enemy'}
                    className="h-44 pixel-perfect drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.5)) drop-shadow(0 0 40px rgba(239,68,68,0.3))',
                      transform: effects?.enemyShake ? 'translateX(6px)' : 'translateX(0)',
                      transition: 'transform 100ms ease'
                    }}
                    onError={(e) => {
                      console.error('Failed to load enemy sprite:', enemy.sprite);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-red-500 text-6xl">👹</div>
                )}
              </div>
            </div>

            {/* Player Panel */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center px-2">
                <span className="fantasy-text text-xs px-3 py-1 bg-blue-900/40 rounded border border-blue-700">
                  Lv {player.level}
                </span>
                <h3 className="fantasy-title text-lg">⚔️ HERO</h3>
              </div>
              <div className="health-bar-container">
                <div 
                  className="health-bar-fill"
                  style={{ width: `${Math.max(0, (player.health / player.maxHealth) * 100)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="fantasy-text text-xs font-bold" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.9)' }}>
                    {player.health}/{player.maxHealth}
                  </span>
                </div>
              </div>
              <div className="h-56 flex items-center justify-center bg-gradient-to-b from-blue-950/20 to-transparent rounded-lg border-2 border-blue-900/30">
                <div className="relative w-40 h-40">
                  <img
                    src={playerFront}
                    alt="player"
                    className="absolute left-0 top-0 h-32 pixel-perfect drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.4)) drop-shadow(0 0 40px rgba(59,130,246,0.2))',
                      transform: effects?.playerShake ? 'translateX(-6px)' : 'translateX(0)',
                      transition: 'transform 100ms ease'
                    }}
                  />
                  <img
                    src={ironSword}
                    alt="sword"
                    className="absolute right-0 top-12 h-12 pixel-perfect drop-shadow-lg -rotate-2"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.4))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Command Box */}
          <div className="border-t-4 border-amber-700 bg-gradient-to-b from-amber-950/40 to-amber-900/50 p-8 rounded-b-2xl">
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <div className="fantasy-title text-base leading-relaxed text-center">
                  {playerTurn ? (
                    <span className="text-green-400">⚔️ YOUR TURN!</span>
                  ) : (
                    <span className="text-red-400">👹 ENEMY TURN...</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  data-testid={`btn-attack-${playerTurn ? 'enabled' : 'disabled'}`} 
                  onClick={onAttack} 
                  disabled={!playerTurn} 
                  className="pixel-btn px-6 py-4 flex items-center justify-center gap-2"
                >
                  <span>⚔️</span>
                  <span>ATTACK</span>
                </button>
                <button 
                  data-testid={`btn-bag-${playerTurn ? 'enabled' : 'disabled'}`} 
                  onClick={onUseItem} 
                  disabled={!hasConsumable || !playerTurn} 
                  className="pixel-btn px-6 py-4 flex items-center justify-center gap-2"
                >
                  <span>🎒</span>
                  <span>BAG</span>
                </button>
                <button 
                  data-testid={`btn-run-${playerTurn ? 'enabled' : 'disabled'}`} 
                  onClick={onRun} 
                  disabled={!playerTurn} 
                  className="pixel-btn px-6 py-4 flex items-center justify-center gap-2"
                >
                  <span>🏃</span>
                  <span>RUN</span>
                </button>
                <div />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* keyframes for damage float */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -20%); }
          100% { opacity: 0; transform: translate(-50%, -100%); }
        }
      `}</style>
    </div>
  );
};

export default BattleInterface;


