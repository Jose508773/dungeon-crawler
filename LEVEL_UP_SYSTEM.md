# Level Up System Documentation

## Overview
A comprehensive level-up system with visual notifications, scaling stat progression, and milestone bonuses.

## Features

### 1. **Experience & Leveling**
- **XP Requirement**: `level * 100` (e.g., Level 1 → 2 requires 100 XP, Level 2 → 3 requires 200 XP)
- **XP Sources**: Defeating enemies in combat
- **Automatic Leveling**: When XP threshold is reached, player automatically levels up

### 2. **Stat Progression**

#### Regular Levels (1, 2, 3, 4, 6, 7, 8, 9, etc.)
- **Health**: +20 HP + (5 HP per tier)
  - Tier = floor(level / 5)
  - Level 1-4: +20 HP
  - Level 6-9: +25 HP
  - Level 11-14: +30 HP
- **Attack**: +2
- **Defense**: +1

#### Milestone Levels (5, 10, 15, 20, etc.)
Every 5 levels, players receive **bonus stats**:
- **Health**: +20 HP + (5 HP per tier) + **15 bonus HP**
  - Level 5: +35 HP
  - Level 10: +40 HP
  - Level 15: +45 HP
- **Attack**: +2 + **1 bonus** = +3 total
- **Defense**: +1 + **1 bonus** = +2 total
- **Special Message**: "🌟 MILESTONE LEVEL X! 🌟 You feel significantly stronger!"

### 3. **Level Up Benefits**
- ✨ **Full Health Restoration**: HP restored to new maximum
- 📈 **Permanent Stat Increases**: Stats grow with each level
- 🎯 **Visual Celebration**: Animated notification modal
- 🎨 **Special Effects**: Particle animations and glowing effects

### 4. **Visual Notifications**

#### Standard Level Up
- Golden star icon with rotation animation
- "🎉 LEVEL UP! 🎉" header
- Display of all stat increases
- Auto-closes after 5 seconds (can close manually)

#### Milestone Level Up (Every 5 levels)
- Multi-colored gradient star (red, gold, cyan)
- Enhanced glow effects
- "✨ MILESTONE! ✨" header
- "🌟 Bonus Stats Awarded! 🌟" badge
- Larger text and more dramatic animations

### 5. **UI Components**

#### LevelUpNotification.jsx
```jsx
<LevelUpNotification
  levelUpData={{
    newLevel: number,
    healthIncrease: number,
    attackIncrease: number,
    defenseIncrease: number,
    isBonusLevel: boolean,
    message: string
  }}
  onClose={() => {}}
/>
```

**Features**:
- Animated entrance/exit
- Floating sparkle particles
- Stat breakdown with color-coded icons
- Health restoration indicator
- Responsive design
- Click-to-close or auto-close

#### HUD Display
- Shows current XP progress bar
- Displays: `{current XP}/{XP needed}`
- Visual animations when XP is gained

### 6. **Combat Integration**

When enemy is defeated:
1. XP and gold are awarded
2. `CombatSystem.applyRewards()` called
3. `handleLevelUp()` checks if level threshold reached
4. If leveled up:
   - Stats are increased
   - Health is fully restored
   - Level up data is stored
   - Combat log is updated
   - **LevelUpNotification** is shown
5. Player continues adventuring with new stats

### 7. **Stat Scaling Examples**

| Level | XP Needed | Health Gain | Attack Gain | Defense Gain | Total HP (approx) |
|-------|-----------|-------------|-------------|--------------|-------------------|
| 1→2   | 100       | +20         | +2          | +1           | 120               |
| 2→3   | 200       | +20         | +2          | +1           | 140               |
| 4→5   | 400       | **+35**     | **+3**      | **+2**       | 195               |
| 9→10  | 900       | **+40**     | **+3**      | **+2**       | 360               |
| 14→15 | 1400      | **+45**     | **+3**      | **+2**       | 570               |

### 8. **Code Structure**

#### CombatSystem.js
```javascript
static handleLevelUp(player) {
  // Calculates stat increases
  // Handles milestone bonuses
  // Returns level up data
}

static applyRewards(player, combatResults) {
  // Applies XP and gold
  // Triggers level up check
  // Returns rewards including level up
}
```

#### Game.jsx
```javascript
// State
const [levelUpData, setLevelUpData] = useState(null);

// Battle handler
if (rewards.levelUp && rewards.levelUp.leveledUp) {
  setLevelUpData(rewards.levelUp); // Show notification
}

// Render
{levelUpData && (
  <LevelUpNotification
    levelUpData={levelUpData}
    onClose={() => setLevelUpData(null)}
  />
)}
```

### 9. **Animations**

#### CSS Animations (App.css)
- `xpGain`: Scale and brightness increase when XP gained
- `levelUpFlash`: Glow effect on level up
- `levelUpPulse`: Notification entrance animation
- `particleFloat`: Floating sparkle particles
- `titleGlow`: Pulsing title text
- `spin`: Rotating star icon

#### Animation Classes
- `.xp-gained`: Apply to XP display on gain
- `.level-up-flash`: Apply to stat panels on level up

### 10. **Player Stats Formula**

Starting Stats (Level 1):
- Health: 100
- Max Health: 100
- Attack: 10
- Defense: 2
- Experience: 0
- Gold: 0

At Level 10 (milestone):
- Health: ~360
- Attack: ~30
- Defense: ~12

At Level 20 (milestone):
- Health: ~760
- Attack: ~50
- Defense: ~22

### 11. **Future Enhancements**
Potential additions to the system:
- 🎵 Sound effects for level up
- 🎁 Unlock new abilities at certain levels
- 🏆 Achievement system for level milestones
- 📊 Skill points allocation
- 🌟 Prestige/ascension system
- 💫 Visual effect on game board when leveling
- 📈 Level up history/statistics

### 12. **Balance Considerations**
- Early levels are quick to encourage engagement
- Later levels require more XP but give bigger rewards
- Milestone bonuses keep progression exciting
- Full heal on level up encourages tactical timing
- Stats scale to match increasing dungeon difficulty

## Testing Checklist
- [x] Level up triggers at correct XP threshold
- [x] Stats increase properly
- [x] Milestone levels give bonus stats
- [x] Health fully restores on level up
- [x] Notification displays correctly
- [x] Multiple level ups in succession work
- [x] Level up data persists in combat log
- [x] XP bar updates smoothly
- [x] Animations play correctly
- [x] Auto-close works after 5 seconds

## Dependencies
- React hooks (useState, useEffect)
- Lucide React icons
- Fantasy pixel art CSS system
- CombatSystem utility
- Game state management
