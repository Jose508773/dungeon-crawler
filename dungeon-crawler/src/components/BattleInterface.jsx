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
  if (!enemy) return null;

  const hasConsumable = Array.isArray(inventory?.items) && inventory.items.some(i => i.type === 'consumable');

  return (
    <div className="fixed inset-0 fantasy-modal-overlay z-50 flex items-center justify-center">
      {/* Fantasy battle frame */}
      <div className="fantasy-panel p-4 rounded-xl magical-glow max-w-5xl w-full mx-4">
        <div className="fantasy-card p-6">
          <div className="grid grid-cols-2 gap-8 relative">
            {/* Floating damage numbers */}
            {(effects?.floats || []).map(f => (
              <div key={f.id} className="absolute text-2xl font-bold text-shadow-lg animate-bounce"
                style={{
                  left: f.side === 'enemy' ? '25%' : '75%',
                  top: '30%',
                  transform: 'translate(-50%, -50%)',
                  color: f.color,
                  textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                  animation: 'floatUp 0.8s ease forwards'
                }}>{f.text}</div>
            ))}
            
            {/* Enemy Panel */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="fantasy-title text-xl">👹 {enemy.name}</h3>
                <span className="fantasy-text text-sm">Lv ?</span>
              </div>
              <Bar testId="enemy-hp-label" label="HP" current={enemy.health} max={enemy.maxHealth} color="#ef4444" />
              <div className="h-48 flex items-center justify-center">
                <img
                  src={enemy.sprite || undefined}
                  alt={enemy.name}
                  className="h-36 image-rendering-pixelated drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 0 14px rgba(239,68,68,0.35))',
                    transform: effects?.enemyShake ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 90ms ease'
                  }}
                />
              </div>
            </div>

            {/* Player Panel */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="fantasy-text text-sm">Lv {player.level}</span>
                <h3 className="fantasy-title text-xl">⚔️ Hero</h3>
              </div>
              <Bar testId="player-hp-label" label="HP" current={player.health} max={player.maxHealth} color="#22c55e" />
              <div className="h-48 flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <img
                    src={playerFront}
                    alt="player"
                    className="absolute left-0 top-0 h-28 image-rendering-pixelated drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(0 0 14px rgba(59,130,246,0.25))',
                      transform: effects?.playerShake ? 'translateX(-4px)' : 'translateX(0)',
                      transition: 'transform 90ms ease'
                    }}
                  />
                  <img
                    src={ironSword}
                    alt="sword"
                    className="absolute right-0 top-10 h-10 image-rendering-pixelated drop-shadow-sm -rotate-2"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.2))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Command Box */}
          <div className="border-t-2 border-amber-600 bg-gradient-to-b from-amber-900/20 to-amber-800/30 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="fantasy-text text-lg">
                  {playerTurn ? '⚔️ Choose your action!' : '👹 Enemy is acting...'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  data-testid={`btn-attack-${playerTurn ? 'enabled' : 'disabled'}`} 
                  onClick={onAttack} 
                  disabled={!playerTurn} 
                  className="fantasy-button px-4 py-3 text-lg font-bold"
                >
                  ⚔️ ATTACK
                </Button>
                <Button 
                  data-testid={`btn-bag-${playerTurn ? 'enabled' : 'disabled'}`} 
                  onClick={onUseItem} 
                  disabled={!hasConsumable || !playerTurn} 
                  className="fantasy-button px-4 py-3 text-lg font-bold"
                >
                  🎒 BAG
                </Button>
                <Button 
                  data-testid={`btn-run-${playerTurn ? 'enabled' : 'disabled'}`} 
                  onClick={onRun} 
                  disabled={!playerTurn} 
                  className="fantasy-button px-4 py-3 text-lg font-bold"
                >
                  🏃 RUN
                </Button>
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


