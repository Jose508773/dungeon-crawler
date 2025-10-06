import React, { useEffect, useState } from 'react';

const DamageNumber = ({ 
  damage, 
  x, 
  y, 
  isCritical = false, 
  isHeal = false,
  isMiss = false,
  side = 'enemy',
  onComplete 
}) => {
  const [position, setPosition] = useState({ x, y });
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(isCritical ? 0.5 : 0.8);

  useEffect(() => {
    const startTime = Date.now();
    const duration = isCritical ? 1200 : 1000;
    const floatDistance = isCritical ? 120 : 80;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        if (onComplete) onComplete();
        return;
      }

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      // Float upward
      setPosition({
        x: x + (Math.sin(progress * Math.PI * 2) * 10), // Slight wave motion
        y: y - (floatDistance * easeOut)
      });

      // Scale animation
      if (isCritical) {
        // Pop effect for critical hits
        if (progress < 0.2) {
          setScale(0.5 + (progress / 0.2) * 1.3); // Grow to 1.8
        } else if (progress < 0.4) {
          setScale(1.8 - ((progress - 0.2) / 0.2) * 0.5); // Settle to 1.3
        } else {
          setScale(1.3);
        }
      } else {
        // Gentle scale for normal hits
        if (progress < 0.15) {
          setScale(0.8 + (progress / 0.15) * 0.3);
        } else {
          setScale(1.1);
        }
      }

      // Fade out in the last 30% of animation
      if (progress > 0.7) {
        setOpacity(1 - ((progress - 0.7) / 0.3));
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [x, y, isCritical, onComplete]);

  const getTextStyle = () => {
    let color, textShadow, fontSize;

    if (isMiss) {
      color = '#aaaaaa';
      textShadow = '2px 2px 0 rgba(0,0,0,0.8)';
      fontSize = '24px';
    } else if (isHeal) {
      color = '#00ff7f';
      textShadow = `
        2px 2px 0 rgba(0,0,0,0.9),
        0 0 10px rgba(0,255,127,0.8),
        0 0 20px rgba(0,255,127,0.6)
      `;
      fontSize = isCritical ? '42px' : '28px';
    } else if (isCritical) {
      color = '#ff0000';
      textShadow = `
        3px 3px 0 rgba(0,0,0,0.9),
        0 0 15px rgba(255,0,0,1),
        0 0 30px rgba(255,0,0,0.8),
        0 0 45px rgba(255,0,0,0.6)
      `;
      fontSize = '48px';
    } else {
      color = side === 'enemy' ? '#ff6b6b' : '#ffd700';
      textShadow = `
        2px 2px 0 rgba(0,0,0,0.9),
        0 0 10px ${side === 'enemy' ? 'rgba(255,107,107,0.6)' : 'rgba(255,215,0,0.6)'}
      `;
      fontSize = '32px';
    }

    return {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: `translate(-50%, -50%) scale(${scale})`,
      color,
      fontSize,
      fontWeight: '900',
      fontFamily: '"Press Start 2P", monospace',
      letterSpacing: '0.1em',
      textShadow,
      opacity,
      pointerEvents: 'none',
      zIndex: 1000,
      userSelect: 'none',
      WebkitTextStroke: isCritical ? '2px rgba(0,0,0,0.8)' : '1px rgba(0,0,0,0.6)'
    };
  };

  const getText = () => {
    if (isMiss) return 'MISS!';
    if (isHeal) return `+${damage}`;
    if (isCritical) return `${damage}!`;
    return damage;
  };

  return (
    <div style={getTextStyle()}>
      {getText()}
      {isCritical && !isMiss && !isHeal && (
        <div
          style={{
            position: 'absolute',
            top: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '14px',
            color: '#ffff00',
            textShadow: '1px 1px 0 rgba(0,0,0,0.8), 0 0 10px rgba(255,255,0,0.8)',
            letterSpacing: '0.2em',
            animation: 'pulse 0.3s ease-out'
          }}
        >
          CRITICAL
        </div>
      )}
    </div>
  );
};

export default DamageNumber;

