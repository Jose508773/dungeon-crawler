import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Shield, Sword, Star, Coins } from 'lucide-react';

const PlayerStats = ({ player, turn }) => {
  const healthPercentage = (player.health / player.maxHealth) * 100;
  const experienceToNext = player.level * 100; // Simple XP calculation
  const experiencePercentage = (player.experience / experienceToNext) * 100;

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Health */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="stat-icon bg-gradient-to-br from-red-600 to-red-800 border-red-400">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="fantasy-text text-sm font-bold text-amber-400">❤️ HEALTH</span>
            </div>
            <span className="fantasy-text font-bold text-lg">
              {player.health}/{player.maxHealth}
            </span>
          </div>
          <div className="health-bar-container">
            <div 
              className="health-bar-fill"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Level & Experience */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="stat-icon bg-gradient-to-br from-yellow-600 to-yellow-800 border-yellow-400">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="fantasy-text text-sm font-bold text-amber-400">⭐ LEVEL {player.level}</span>
            </div>
            <span className="fantasy-text text-sm font-bold">
              {player.experience}/{experienceToNext}
            </span>
          </div>
          <div className="health-bar-container">
            <div 
              className="xp-bar-fill"
              style={{ 
                width: `${experiencePercentage}%`,
                height: '100%',
                position: 'relative'
              }}
            />
          </div>
        </div>

        {/* Gold */}
        <div className="stat-display">
          <div className="stat-icon bg-gradient-to-br from-yellow-600 to-yellow-800 border-yellow-400">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <span className="fantasy-text text-sm font-bold text-amber-400">💰 GOLD</span>
            <span className="fantasy-text text-xl font-bold text-yellow-400">
              {player.gold}
            </span>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="pt-6 border-t-4 border-amber-700/50 space-y-4">
          <div className="stat-display">
            <span className="fantasy-text text-xs text-amber-400 w-24">🔄 TURN</span>
            <span className="fantasy-text text-sm font-bold">
              {turn}
            </span>
          </div>

          <div className="stat-display">
            <span className="fantasy-text text-xs text-amber-400 w-24">📍 POSITION</span>
            <span className="fantasy-text text-sm font-bold">
              ({player.x}, {player.y})
            </span>
          </div>

          <div className="stat-display">
            <span className="fantasy-text text-xs text-amber-400 w-24">⚔️ ATTACK</span>
            <span className="fantasy-text text-sm font-bold text-red-400">
              {player.attack}
            </span>
          </div>

          <div className="stat-display">
            <span className="fantasy-text text-xs text-amber-400 w-24">🛡️ DEFENSE</span>
            <span className="fantasy-text text-sm font-bold text-blue-400">
              {player.defense}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;

