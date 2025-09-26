import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Shield, Sword, Star, Coins } from 'lucide-react';

const PlayerStats = ({ player, turn }) => {
  const healthPercentage = (player.health / player.maxHealth) * 100;
  const experienceToNext = player.level * 100; // Simple XP calculation
  const experiencePercentage = (player.experience / experienceToNext) * 100;

  return (
    <div className="fantasy-card p-6">
      <div className="mb-4">
        <h2 className="fantasy-title text-xl flex items-center gap-2">
          <Shield className="w-6 h-6" />
          ⚔️ Character Stats
        </h2>
      </div>
      <div className="space-y-6">
        {/* Health */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="fantasy-text text-sm font-bold">❤️ Health</span>
            </div>
            <span className="fantasy-text text-sm font-bold">
              {player.health}/{player.maxHealth}
            </span>
          </div>
          <div className="fantasy-progress h-4">
            <div 
              className="fantasy-progress-bar bg-gradient-to-r from-red-500 to-red-600"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Level & Experience */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="fantasy-text text-sm font-bold">⭐ Level {player.level}</span>
            </div>
            <span className="fantasy-text text-sm font-bold">
              {player.experience}/{experienceToNext} XP
            </span>
          </div>
          <div className="fantasy-progress h-4">
            <div 
              className="fantasy-progress-bar bg-gradient-to-r from-yellow-500 to-yellow-600"
              style={{ width: `${experiencePercentage}%` }}
            />
          </div>
        </div>

        {/* Gold */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            <span className="fantasy-text text-sm font-bold">💰 Gold</span>
          </div>
          <span className="fantasy-text text-lg font-bold text-yellow-400">
            {player.gold}
          </span>
        </div>

        {/* Turn Counter */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-amber-600">
          <span className="fantasy-text text-sm font-bold">🔄 Turn</span>
          <span className="fantasy-text text-sm font-bold">
            {turn}
          </span>
        </div>

        {/* Position */}
        <div className="flex items-center justify-between">
          <span className="fantasy-text text-sm font-bold">📍 Position</span>
          <span className="fantasy-text text-sm font-bold">
            ({player.x}, {player.y})
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;

