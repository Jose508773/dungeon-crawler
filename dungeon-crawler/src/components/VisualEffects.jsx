import React, { useEffect, useState } from 'react';

// Particle component for individual particles
const Particle = ({ x, y, color, size, velocity, lifetime, type }) => {
  const [opacity, setOpacity] = useState(1);
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / lifetime;

      if (progress >= 1) {
        setOpacity(0);
        return;
      }

      // Update position based on velocity
      setPosition(prev => ({
        x: prev.x + velocity.x,
        y: prev.y + velocity.y
      }));

      // Fade out over time
      setOpacity(1 - progress);

      requestAnimationFrame(animate);
    };

    animate();
  }, [velocity, lifetime]);

  const getParticleStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${size}px`,
      height: `${size}px`,
      opacity,
      pointerEvents: 'none',
      transition: 'opacity 0.1s ease-out'
    };

    switch (type) {
      case 'spark':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${color}, transparent)`,
          boxShadow: `0 0 ${size * 2}px ${color}`,
          borderRadius: '50%'
        };
      case 'flame':
        return {
          ...baseStyle,
          background: `linear-gradient(to top, ${color}, rgba(255, 200, 0, 0))`,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
        };
      case 'ice':
        return {
          ...baseStyle,
          background: color,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          filter: `drop-shadow(0 0 ${size}px ${color})`
        };
      case 'star':
        return {
          ...baseStyle,
          background: color,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          filter: `drop-shadow(0 0 ${size * 2}px ${color})`
        };
      case 'smoke':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${color}, transparent)`,
          borderRadius: '50%',
          filter: 'blur(3px)'
        };
      default:
        return {
          ...baseStyle,
          background: color,
          borderRadius: '50%'
        };
    }
  };

  return <div style={getParticleStyle()} />;
};

// Main particle system component
export const ParticleSystem = ({ particles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      {particles.map((particle) => (
        <Particle key={particle.id} {...particle} />
      ))}
    </div>
  );
};

// Spell casting effect
export const SpellCastEffect = ({ x, y, spellType, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const configs = {
      fire: {
        color: '#ff4500',
        particleType: 'flame',
        count: 30,
        spread: 360
      },
      ice: {
        color: '#00bfff',
        particleType: 'ice',
        count: 25,
        spread: 360
      },
      lightning: {
        color: '#ffff00',
        particleType: 'spark',
        count: 40,
        spread: 180
      },
      holy: {
        color: '#ffd700',
        particleType: 'star',
        count: 35,
        spread: 360
      },
      dark: {
        color: '#8b00ff',
        particleType: 'smoke',
        count: 30,
        spread: 360
      },
      heal: {
        color: '#00ff00',
        particleType: 'star',
        count: 25,
        spread: 360
      }
    };

    const config = configs[spellType] || configs.fire;

    // Generate particles
    const newParticles = Array.from({ length: config.count }, (_, i) => {
      const angle = (i / config.count) * config.spread * (Math.PI / 180);
      const speed = 2 + Math.random() * 3;
      
      return {
        id: `spell-${Date.now()}-${i}`,
        x,
        y,
        color: config.color,
        size: 4 + Math.random() * 6,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 2 // Slight upward bias
        },
        lifetime: 600 + Math.random() * 400,
        type: config.particleType
      };
    });

    setParticles(newParticles);

    // Clear particles after animation
    const timeout = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [x, y, spellType, onComplete]);

  return <ParticleSystem particles={particles} />;
};

// Critical hit effect
export const CriticalHitEffect = ({ x, y, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 800);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        animation: 'criticalPulse 0.8s ease-out forwards',
        zIndex: 200
      }}
    >
      <div className="relative">
        {/* Outer ring */}
        <div
          className="absolute"
          style={{
            width: '100px',
            height: '100px',
            border: '3px solid #ff0000',
            borderRadius: '50%',
            animation: 'expandFade 0.8s ease-out forwards',
            boxShadow: '0 0 20px #ff0000'
          }}
        />
        {/* Inner burst */}
        <div
          className="absolute"
          style={{
            width: '60px',
            height: '60px',
            left: '20px',
            top: '20px',
            background: 'radial-gradient(circle, rgba(255,0,0,0.8), transparent)',
            borderRadius: '50%',
            animation: 'pulse 0.4s ease-out'
          }}
        />
        {/* Star burst lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: '40px',
              height: '3px',
              left: '30px',
              top: '48px',
              background: 'linear-gradient(to right, #ff0000, transparent)',
              transformOrigin: 'left center',
              transform: `rotate(${angle}deg)`,
              animation: 'lineExpand 0.6s ease-out forwards',
              boxShadow: '0 0 10px #ff0000'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes criticalPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        
        @keyframes expandFade {
          0% { transform: scale(0.2); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes lineExpand {
          0% { width: 0px; opacity: 1; }
          100% { width: 40px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Impact effect for hits
export const ImpactEffect = ({ x, y, color = '#ffffff', size = 'normal', onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = size === 'large' ? 20 : 12;
    const particleSize = size === 'large' ? 8 : 5;

    // Create radial burst of particles
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * 360 * (Math.PI / 180);
      const speed = 3 + Math.random() * 2;
      
      return {
        id: `impact-${Date.now()}-${i}`,
        x,
        y,
        color,
        size: particleSize + Math.random() * 3,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        lifetime: 400 + Math.random() * 200,
        type: 'spark'
      };
    });

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 700);

    return () => clearTimeout(timeout);
  }, [x, y, color, size, onComplete]);

  return <ParticleSystem particles={particles} />;
};

// Healing effect
export const HealingEffect = ({ x, y, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create upward floating healing particles
    const newParticles = Array.from({ length: 15 }, (_, i) => {
      const offsetX = (Math.random() - 0.5) * 60;
      
      return {
        id: `heal-${Date.now()}-${i}`,
        x: x + offsetX,
        y: y + 40,
        color: '#00ff7f',
        size: 6 + Math.random() * 4,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: -2 - Math.random() * 2
        },
        lifetime: 800 + Math.random() * 400,
        type: 'star'
      };
    });

    setParticles(newParticles);

    const timeout = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, 1400);

    return () => clearTimeout(timeout);
  }, [x, y, onComplete]);

  return <ParticleSystem particles={particles} />;
};

// Screen shake hook
export const useScreenShake = () => {
  const [shake, setShake] = useState({ x: 0, y: 0, intensity: 0 });

  const triggerShake = (intensity = 1, duration = 300) => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setShake({ x: 0, y: 0, intensity: 0 });
        return;
      }

      const currentIntensity = intensity * (1 - progress);
      setShake({
        x: (Math.random() - 0.5) * 20 * currentIntensity,
        y: (Math.random() - 0.5) * 20 * currentIntensity,
        intensity: currentIntensity
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  return { shake, triggerShake };
};

export default {
  ParticleSystem,
  SpellCastEffect,
  CriticalHitEffect,
  ImpactEffect,
  HealingEffect,
  useScreenShake
};

