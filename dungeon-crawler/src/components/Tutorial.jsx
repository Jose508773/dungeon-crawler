import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Book } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: '🏰 Welcome to Dark Depths Crawler!',
    content: `You are a brave adventurer exploring procedurally generated dungeons filled with monsters, treasure, and danger. Your goal is to descend through the levels, defeat enemies, and survive as long as possible!`,
    image: '⚔️'
  },
  {
    id: 'movement',
    title: '🚶 Movement & Controls',
    content: `Use WASD or Arrow Keys to move through the dungeon. Each movement consumes one turn. Press SPACEBAR to wait/skip a turn. Press ESC to pause the game.`,
    tips: [
      'Movement is turn-based - enemies move after you',
      'Explore carefully to reveal the fog of war',
      'Look for treasure chests and stairs to the next level'
    ]
  },
  {
    id: 'combat',
    title: '⚔️ Combat System',
    content: `Moving adjacent to an enemy triggers automatic combat. You'll enter a battle interface where you can Attack, Use Items, or Run. Combat is turn-based - choose your actions wisely!`,
    tips: [
      'Check enemy health before engaging',
      'Higher attack deals more damage',
      'Defense reduces incoming damage',
      'Critical hits deal bonus damage (10% chance)'
    ]
  },
  {
    id: 'skills',
    title: '✨ Skills & Abilities',
    content: `Gain Skill Points when you level up! Open the Skills menu to learn powerful active and passive abilities across three branches: Combat, Defense, and Magic.`,
    tips: [
      'Active skills: Used in battle with cooldowns',
      'Passive skills: Always active bonuses',
      'Plan your build - skills have requirements',
      'Combat: Damage and offense',
      'Defense: Survivability and protection',
      'Magic: Healing and special abilities'
    ]
  },
  {
    id: 'inventory',
    title: '🎒 Inventory & Equipment',
    content: `Collect weapons, armor, and consumables from treasure chests. Equip items to improve your stats, or sell them for gold. Potions can save your life in tough battles!`,
    tips: [
      'Weapons increase attack damage',
      'Armor increases defense',
      'Potions restore health in battle',
      'Procedurally generated weapons have unique names and stats',
      'Legendary items are extremely rare and powerful'
    ]
  },
  {
    id: 'progression',
    title: '📈 Progression & Leveling',
    content: `Defeat enemies to gain Experience and Gold. Level up to increase your stats and earn Skill Points. Your health is fully restored when you level up!`,
    tips: [
      'XP requirement: Level × 100',
      'Milestone levels (5, 10, 15) give bonus stats',
      'Each level increases HP, Attack, and Defense',
      'Manage your health - death is permanent!'
    ]
  },
  {
    id: 'enemies',
    title: '👹 Enemy Types',
    content: `Face various enemy types with unique behaviors:`,
    tips: [
      '💀 Skeletons: Basic melee fighters',
      '🏹 Goblins: Ranged attackers, keep distance',
      '⛰️ Golems: High defense tanks',
      '👻 Wraiths: Fast magical attackers',
      '🐉 Bosses: Powerful enemies with special patterns'
    ]
  },
  {
    id: 'strategy',
    title: '🎯 Pro Tips & Strategy',
    content: `Master these strategies to survive deeper into the dungeon:`,
    tips: [
      'Explore thoroughly to find all treasure',
      'Save healing items for emergencies',
      'Learn defensive skills for survivability',
      'Kite enemies to avoid taking too much damage',
      'Each dungeon theme has different difficulty',
      'Plan your skill tree based on your playstyle',
      'Use active skills strategically - they have cooldowns'
    ]
  }
];

const Tutorial = ({ onClose, isFirstTime = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const currentContent = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('dungeonCrawlerTutorialCompleted', 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 modal-overlay-enhanced flex items-center justify-center p-4">
      <div className="fantasy-panel-enhanced w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-amber-900">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-400" />
            <h2 className="game-title text-base text-amber-400">
              How to Play
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="pixel-btn p-1 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-4 pt-4">
          <div className="flex gap-1">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded ${
                  index === currentStep
                    ? 'bg-amber-400'
                    : index < currentStep
                    ? 'bg-amber-600'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="text-center fantasy-text text-[10px] text-gray-400 mt-1">
            {currentStep + 1} / {TUTORIAL_STEPS.length}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-3">{currentContent.image}</div>
            <h3 className="game-title text-lg text-amber-300 mb-2">
              {currentContent.title}
            </h3>
          </div>

          <div className="fantasy-panel p-3">
            <p className="fantasy-text text-sm text-gray-200 leading-relaxed">
              {currentContent.content}
            </p>
          </div>

          {currentContent.tips && (
            <div className="space-y-2">
              <h4 className="fantasy-text text-xs text-amber-400 font-bold">
                💡 Key Points:
              </h4>
              <ul className="space-y-1.5">
                {currentContent.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="fantasy-panel p-2 fantasy-text text-xs text-gray-300 leading-relaxed"
                  >
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-amber-900 space-y-3">
          {isFirstTime && isLast && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="fantasy-text text-xs text-gray-400">
                Don't show this tutorial again
              </span>
            </label>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className="pixel-btn px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="pixel-btn px-4 py-2 flex-1 bg-amber-600 hover:bg-amber-500 flex items-center justify-center gap-1"
            >
              <span className="text-xs">
                {isLast ? 'Start Playing!' : 'Next'}
              </span>
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>

            {!isFirst && (
              <button
                onClick={handleClose}
                className="pixel-btn px-4 py-2 hover:bg-gray-700"
              >
                <span className="text-xs">Skip</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Tooltip component for in-game hints
export const GameTooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
        >
          <div className="fantasy-panel p-2 max-w-xs shadow-xl border-amber-500">
            <p className="fantasy-text text-[10px] text-gray-200 whitespace-normal">
              {content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Quick help overlay component
export const QuickHelp = () => {
  return (
    <div className="fantasy-panel-enhanced p-3 space-y-2">
      <h3 className="game-title text-sm text-amber-400 mb-2">⌨️ Controls</h3>
      <div className="space-y-1 fantasy-text text-xs text-gray-300">
        <div className="flex justify-between">
          <span>Movement:</span>
          <span className="text-amber-300">WASD / Arrow Keys</span>
        </div>
        <div className="flex justify-between">
          <span>Wait/Skip Turn:</span>
          <span className="text-amber-300">Spacebar</span>
        </div>
        <div className="flex justify-between">
          <span>Pause:</span>
          <span className="text-amber-300">ESC</span>
        </div>
        <div className="flex justify-between">
          <span>Open Inventory:</span>
          <span className="text-amber-300">Click Inventory Icon</span>
        </div>
        <div className="flex justify-between">
          <span>Open Skills:</span>
          <span className="text-amber-300">Click Skills Icon</span>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;

