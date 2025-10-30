import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { META_UPGRADES, getSouls, purchaseUpgrade, isUnlocked } from '../utils/MetaProgression';

const MetaUpgrades = ({ onStartRun }) => {
  const setRefresh = useState(0)[1];
  const souls = getSouls();

  const handleBuy = (id) => {
    const result = purchaseUpgrade(id);
    if (result.success) setRefresh(v => v + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <Card className="w-full max-w-2xl fantasy-panel-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="game-title">Hub: Meta Upgrades</span>
            <span className="fantasy-text">Eternal Souls: {souls}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {META_UPGRADES.map(upg => {
              const unlocked = isUnlocked(upg.id);
              return (
                <div key={upg.id} className="flex items-center justify-between p-3 rounded-md bg-black/30 border border-amber-900/40">
                  <div>
                    <div className="fantasy-text text-amber-300">{upg.name}</div>
                    <div className="text-xs text-amber-200/70">Cost: {upg.cost} souls</div>
                  </div>
                  {unlocked ? (
                    <span className="text-emerald-400 fantasy-text">Unlocked</span>
                  ) : (
                    <Button onClick={() => handleBuy(upg.id)} disabled={souls < upg.cost}>
                      Purchase
                    </Button>
                  )}
                </div>
              );
            })}
            <div className="pt-4 flex justify-end">
              <Button onClick={onStartRun}>
                Start New Run
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaUpgrades;


