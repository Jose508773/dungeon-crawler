import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Shield, Sword, Star, Coins } from 'lucide-react';

const PlayerStats = ({ player, turn }) => {
  const healthPercentage = (player.health / player.maxHealth) * 100;
  const experienceToNext = player.level * 100; // Simple XP calculation
  const experiencePercentage = (player.experience / experienceToNext) * 100;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Character Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Health</span>
            </div>
            <span className="text-sm text-gray-400">
              {player.health}/{player.maxHealth}
            </span>
          </div>
          <Progress 
            value={healthPercentage} 
            className="h-2"
            style={{
              '--progress-background': '#dc2626',
              '--progress-foreground': '#ef4444'
            }}
          />
        </div>

        {/* Level & Experience */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Level {player.level}</span>
            </div>
            <span className="text-sm text-gray-400">
              {player.experience}/{experienceToNext} XP
            </span>
          </div>
          <Progress 
            value={experiencePercentage} 
            className="h-2"
            style={{
              '--progress-background': '#eab308',
              '--progress-foreground': '#fbbf24'
            }}
          />
        </div>

        {/* Gold */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Gold</span>
          </div>
          <span className="text-sm text-yellow-400 font-bold">
            {player.gold}
          </span>
        </div>

        {/* Turn Counter */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <span className="text-sm font-medium">Turn</span>
          <span className="text-sm text-gray-400">
            {turn}
          </span>
        </div>

        {/* Position */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Position</span>
          <span className="text-sm text-gray-400">
            ({player.x}, {player.y})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStats;

