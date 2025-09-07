import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skull, Trophy, RotateCcw } from 'lucide-react';

const GameOverScreen = ({ player, dungeonLevel, turn, onRestart, victory = false }) => {
  const finalScore = player.gold + (player.experience * 2) + (dungeonLevel * 100) + (player.level * 50);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <Card className="bg-gray-800 border-gray-700 max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle className={`text-2xl font-bold flex items-center justify-center gap-3 ${
            victory ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {victory ? <Trophy className="w-8 h-8" /> : <Skull className="w-8 h-8" />}
            {victory ? 'Victory!' : 'Game Over'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              {victory 
                ? 'Congratulations! You have conquered the dungeon!' 
                : 'Your adventure has come to an end...'}
            </p>
          </div>

          {/* Final Stats */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-orange-400 text-center">
              Final Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Level Reached</div>
                <div className="text-white font-bold">{player.level}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Dungeon Level</div>
                <div className="text-white font-bold">{dungeonLevel}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Gold Collected</div>
                <div className="text-yellow-400 font-bold">{player.gold}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Experience</div>
                <div className="text-blue-400 font-bold">{player.experience}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Turns Survived</div>
                <div className="text-green-400 font-bold">{turn}</div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <div className="text-gray-400">Final Score</div>
                <div className="text-orange-400 font-bold">{finalScore}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={onRestart}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>

          {/* Flavor Text */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-700 pt-4">
            {victory 
              ? "The darkness has been vanquished, and the realm is safe once more."
              : "The dungeon claims another soul. Will you dare to venture forth again?"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;

