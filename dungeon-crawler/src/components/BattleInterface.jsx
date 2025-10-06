import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import playerFront from '../assets/sprites/characters/player_front.png';
import ironSword from '../assets/sprites/items/iron_sword.png';
import { SKILLS, SKILL_TYPES } from '../utils/SkillSystem';
import { X, Sparkles } from 'lucide-react';
import DamageNumber from './DamageNumber';
import { 
  CriticalHitEffect, 
  ImpactEffect, 
  SpellCastEffect, 
  HealingEffect 
} from './VisualEffects';

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

const BattleInterface = ({ 
  player, 
  enemy, 
  onAttack, 
  onRun, 
  onUseItem, 
  inventory, 
  playerTurn, 
  effects,
  learnedSkills = {},
  skillCooldowns = {},
  onUseSkill
}) => {
  const [showSpellModal, setShowSpellModal] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [visualEffects, setVisualEffects] = useState([]);
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });

  // Trigger screen shake
  const triggerScreenShake = (intensity = 1, duration = 300) => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setScreenShake({ x: 0, y: 0 });
        return;
      }

      const currentIntensity = intensity * (1 - progress);
      setScreenShake({
        x: (Math.random() - 0.5) * 15 * currentIntensity,
        y: (Math.random() - 0.5) * 15 * currentIntensity
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  // Add damage number
  const addDamageNumber = (damage, x, y, options = {}) => {
    const id = `dmg-${Date.now()}-${Math.random()}`;
    const newDamage = {
      id,
      damage,
      x,
      y,
      ...options
    };
    
    setDamageNumbers(prev => [...prev, newDamage]);
    
    // Remove after animation
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1500);
  };

  // Add visual effect
  const addVisualEffect = (type, x, y, options = {}) => {
    const id = `fx-${Date.now()}-${Math.random()}`;
    const newEffect = {
      id,
      type,
      x,
      y,
      ...options
    };
    
    setVisualEffects(prev => [...prev, newEffect]);
    
    // Remove after animation
    setTimeout(() => {
      setVisualEffects(prev => prev.filter(e => e.id !== id));
    }, 1500);
  };

  // Listen for battle effects
  useEffect(() => {
    if (effects?.floats) {
      effects.floats.forEach(float => {
        const x = float.side === 'enemy' ? window.innerWidth * 0.3 : window.innerWidth * 0.7;
        const y = window.innerHeight * 0.4;
        
        addDamageNumber(float.text, x, y, {
          isCritical: float.isCritical,
          isHeal: float.isHeal,
          isMiss: float.isMiss,
          side: float.side
        });
        
        // Add impact effect
        if (!float.isMiss && !float.isHeal) {
          addVisualEffect('impact', x, y, {
            color: float.isCritical ? '#ff0000' : '#ffffff',
            size: float.isCritical ? 'large' : 'normal'
          });
          
          // Critical hit effect
          if (float.isCritical) {
            addVisualEffect('critical', x, y);
            triggerScreenShake(1.5, 400);
          } else {
            triggerScreenShake(0.5, 200);
          }
        }
        
        // Healing effect
        if (float.isHeal) {
          addVisualEffect('heal', x, y);
        }
      });
    }
    
    // Enemy and player shake
    if (effects?.enemyShake || effects?.playerShake) {
      triggerScreenShake(0.7, 250);
    }
  }, [effects]);

  // Defensive checks to prevent crashes (after hooks)
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
  
  // Get available active skills
  const availableSkills = Object.entries(learnedSkills || {})
    .filter(([skillId, level]) => {
      const skill = SKILLS[skillId];
      return skill && skill.type === SKILL_TYPES.ACTIVE && level > 0;
    })
    .map(([skillId, level]) => ({
      ...SKILLS[skillId],
      level,
      cooldown: skillCooldowns[skillId] || 0
    }));
  
  const hasSkills = availableSkills.length > 0;
  
  const handleUseSkillInBattle = (skillId) => {
    if (onUseSkill) {
      onUseSkill(skillId);
      setShowSpellModal(false);
    }
  };

  return (
    <div className="fixed inset-0 modal-overlay-enhanced z-50 flex items-center justify-center p-8">
      {/* Damage Numbers */}
      {damageNumbers.map(dmg => (
        <DamageNumber
          key={dmg.id}
          damage={dmg.damage}
          x={dmg.x}
          y={dmg.y}
          isCritical={dmg.isCritical}
          isHeal={dmg.isHeal}
          isMiss={dmg.isMiss}
          side={dmg.side}
        />
      ))}
      
      {/* Visual Effects */}
      {visualEffects.map(effect => {
        if (effect.type === 'critical') {
          return <CriticalHitEffect key={effect.id} x={effect.x} y={effect.y} />;
        }
        if (effect.type === 'impact') {
          return <ImpactEffect key={effect.id} x={effect.x} y={effect.y} color={effect.color} size={effect.size} />;
        }
        if (effect.type === 'spell') {
          return <SpellCastEffect key={effect.id} x={effect.x} y={effect.y} spellType={effect.spellType} />;
        }
        if (effect.type === 'heal') {
          return <HealingEffect key={effect.id} x={effect.x} y={effect.y} />;
        }
        return null;
      })}
      
      {/* Fantasy battle frame with screen shake */}
      <div 
        className="fantasy-panel-enhanced rounded-2xl magical-glow max-w-6xl w-full pixel-corners"
        style={{
          transform: `translate(${screenShake.x}px, ${screenShake.y}px)`,
          transition: 'transform 0.05s ease-out'
        }}
      >
        <div className="relative">
          <div className="grid grid-cols-2 gap-12 p-8 relative">
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
                  data-testid={`btn-spells-${playerTurn ? 'enabled' : 'disabled'}`} 
                  onClick={() => setShowSpellModal(true)} 
                  disabled={!hasSkills || !playerTurn} 
                  className="pixel-btn px-6 py-4 flex items-center justify-center gap-2 bg-gradient-to-b from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 disabled:from-gray-700 disabled:to-gray-800"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>SPELLS</span>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spell Selection Modal */}
      {showSpellModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
          <div className="fantasy-panel-enhanced rounded-2xl p-8 max-w-2xl w-full mx-4 pixel-corners magical-glow">
            {/* Close Button */}
            <button
              onClick={() => setShowSpellModal(false)}
              className="absolute top-4 right-4 pixel-btn p-2"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="space-y-6">
              <h2 className="fantasy-title text-2xl flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                CAST SPELL
              </h2>
              
              {availableSkills.length === 0 ? (
                <div className="fantasy-panel p-6 text-center">
                  <p className="fantasy-text text-gray-400">
                    No spells learned yet. Visit the Skill Tree to learn spells!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {availableSkills.map((skill) => {
                    const isOnCooldown = skill.cooldown > 0;
                    
                    return (
                      <button
                        key={skill.id}
                        onClick={() => handleUseSkillInBattle(skill.id)}
                        disabled={isOnCooldown}
                        className={`fantasy-panel p-4 text-left transition-all ${
                          isOnCooldown 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:border-purple-500 hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{skill.icon}</span>
                            <div>
                              <h3 className="fantasy-text text-sm font-bold text-purple-300">
                                {skill.name}
                              </h3>
                              <span className="fantasy-text text-xs text-gray-400">
                                Level {skill.level}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="fantasy-text text-xs text-gray-300 mb-3">
                          {skill.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="fantasy-text text-xs text-purple-400">
                            Cooldown: {skill.cooldown} turns
                          </span>
                          {isOnCooldown && (
                            <span className="fantasy-text text-xs text-orange-400 font-bold">
                              {skill.cooldown} turns left
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              
              <button
                onClick={() => setShowSpellModal(false)}
                className="pixel-btn w-full bg-gradient-to-b from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default BattleInterface;


