import React, { useEffect, useState } from 'react';
import { Star, Heart, Sword, Shield, Sparkles } from 'lucide-react';

const LevelUpNotification = ({ levelUpData, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);
    
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!levelUpData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay-enhanced"
      onClick={handleClose}
    >
      <div 
        className={`fantasy-panel-enhanced rounded-2xl p-8 max-w-md mx-4 pixel-corners magical-glow transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isVisible ? 'levelUpPulse 0.6s ease-out' : 'none'
        }}
      >
        {/* Star particles animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `particleFloat ${2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s infinite`
              }}
            >
              <Sparkles 
                className="text-yellow-400" 
                style={{ 
                  width: `${12 + Math.random() * 12}px`,
                  filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))'
                }} 
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                 style={{
                   background: levelUpData.isBonusLevel
                     ? 'linear-gradient(145deg, #ff6b6b 0%, #ffd700 50%, #4ecdc4 100%)'
                     : 'linear-gradient(145deg, #ffd700 0%, #ffa500 100%)',
                   boxShadow: levelUpData.isBonusLevel
                     ? '0 0 40px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 107, 107, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                     : '0 0 30px rgba(255, 215, 0, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                   animation: levelUpData.isBonusLevel ? 'spin 2s linear infinite, pulse 1s ease infinite' : 'spin 3s linear infinite'
                 }}>
              <Star className="w-12 h-12 text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
            </div>
            <h2 className="game-title text-2xl mb-2" style={{ 
              fontSize: levelUpData.isBonusLevel ? '1.75rem' : '1.5rem',
              animation: 'titleGlow 1.5s ease-in-out infinite alternate',
              color: levelUpData.isBonusLevel ? '#ff6b6b' : undefined
            }}>
              {levelUpData.isBonusLevel ? '✨ MILESTONE! ✨' : '🎉 LEVEL UP! 🎉'}
            </h2>
            <p className="fantasy-text text-xl font-bold text-yellow-400">
              Level {levelUpData.newLevel}
            </p>
            {levelUpData.isBonusLevel && (
              <p className="fantasy-text text-xs mt-2 text-amber-300 animate-pulse">
                🌟 Bonus Stats Awarded! 🌟
              </p>
            )}
          </div>

          {/* Stats Increases */}
          <div className="space-y-3 mb-6">
            <div className="stat-display p-4 bg-gradient-to-r from-red-900/40 to-transparent border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="stat-icon bg-gradient-to-br from-red-600 to-red-800 border-red-400">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="fantasy-text text-sm">Max Health</span>
                </div>
                <span className="fantasy-text text-lg font-bold text-green-400">
                  +{levelUpData.healthIncrease}
                </span>
              </div>
            </div>

            <div className="stat-display p-4 bg-gradient-to-r from-red-900/40 to-transparent border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="stat-icon bg-gradient-to-br from-red-700 to-red-900 border-red-500">
                    <Sword className="w-5 h-5 text-white" />
                  </div>
                  <span className="fantasy-text text-sm">Attack</span>
                </div>
                <span className="fantasy-text text-lg font-bold text-green-400">
                  +{levelUpData.attackIncrease}
                </span>
              </div>
            </div>

            <div className="stat-display p-4 bg-gradient-to-r from-blue-900/40 to-transparent border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="stat-icon bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="fantasy-text text-sm">Defense</span>
                </div>
                <span className="fantasy-text text-lg font-bold text-green-400">
                  +{levelUpData.defenseIncrease}
                </span>
              </div>
            </div>
          </div>

          {/* Health Restored Message */}
          <div className="text-center mb-6">
            <div className="fantasy-text text-sm px-4 py-2 bg-green-900/40 rounded-lg border border-green-700">
              ✨ Health fully restored! ✨
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="pixel-btn w-full px-6 py-3 flex items-center justify-center gap-2"
          >
            <span>CONTINUE</span>
          </button>
        </div>

        {/* Additional animations */}
        <style jsx>{`
          @keyframes levelUpPulse {
            0% {
              transform: scale(0.8);
              box-shadow: 0 0 0 rgba(255, 215, 0, 0.7);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 40px rgba(255, 215, 0, 0.7);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
            }
          }

          @keyframes particleFloat {
            0% {
              opacity: 0;
              transform: translateY(0) scale(0);
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translateY(-100px) scale(1.5);
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LevelUpNotification;
