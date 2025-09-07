# Dungeon Crawler Game Design Document

## Game Overview

**Title:** Dark Depths Crawler
**Genre:** Roguelike Dungeon Crawler
**Platform:** Web Browser (HTML5/JavaScript)
**Target Audience:** Fans of classic roguelikes and dungeon crawlers

## Core Concept

A turn-based dungeon crawler featuring procedurally generated dungeons, permadeath mechanics, and a rich inventory system. Players navigate through dark stone corridors illuminated by flickering torches, battling various enemies while collecting loot and managing resources.

## Visual Style Guide

### Aesthetic Direction
- **Theme:** Dark fantasy medieval dungeon
- **Lighting:** Warm torch lighting creating atmospheric shadows
- **Textures:** Rough stone walls, weathered floors, metal fixtures
- **Art Style:** Detailed pixel art with 32x32 or 64x64 sprites
- **Atmosphere:** Mysterious, dangerous, but not overly grim

### Color Palette
- **Primary Colors:**
  - Deep stone gray (#3a3a3a)
  - Warm torch orange (#ff8c42)
  - Dark shadow black (#1a1a1a)
- **Secondary Colors:**
  - Moss green (#4a5d23)
  - Rust brown (#8b4513)
  - Gold accent (#ffd700)
- **UI Colors:**
  - Interface dark (#2c2c2c)
  - Text light (#e0e0e0)
  - Highlight amber (#ffb347)

### Typography
- **Primary Font:** Pixel-style serif for headings
- **Secondary Font:** Clean pixel sans-serif for UI text
- **Sizes:** 16px for body text, 24px for headings, 12px for small UI elements

## Game Mechanics

### Core Gameplay Loop
1. **Exploration:** Navigate through procedurally generated dungeon rooms
2. **Combat:** Engage enemies in turn-based tactical combat
3. **Looting:** Collect weapons, armor, potions, and treasure
4. **Progression:** Advance deeper into the dungeon
5. **Death:** Permadeath resets progress but retains some meta-progression

### Movement System
- **Turn-based:** Each action (move, attack, use item) consumes one turn
- **Grid-based:** 8-directional movement on a tile grid
- **Line of sight:** Limited vision with torch-based lighting radius
- **Fog of war:** Unexplored areas remain hidden

### Inventory System
- **Grid-based inventory:** Visual item management with drag-and-drop
- **Equipment slots:** Weapon, armor, accessories
- **Item categories:** Weapons, armor, consumables, quest items, treasure
- **Weight/space limits:** Strategic inventory management required

### Combat System
- **Turn-based:** Player acts, then all enemies act
- **Stats:** Health, Attack, Defense, Speed
- **Weapon types:** Swords, axes, bows, magic staves
- **Damage types:** Physical, magical, elemental

### Enemy Types
1. **Skeleton Warrior:** Basic melee enemy
2. **Goblin Archer:** Ranged attacker
3. **Stone Golem:** High defense, slow movement
4. **Shadow Wraith:** Fast, magical attacks
5. **Dungeon Boss:** Powerful end-level enemy

## Technical Specifications

### Technology Stack
- **Frontend:** React.js with TypeScript
- **Styling:** CSS3 with CSS Grid for game board
- **State Management:** React Context API
- **Graphics:** HTML5 Canvas for sprite rendering
- **Audio:** Web Audio API for sound effects

### Performance Requirements
- **Target FPS:** 60fps for smooth animations
- **Load Time:** Under 3 seconds initial load
- **Memory Usage:** Under 100MB RAM
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

### File Structure
```
dungeon-crawler/
├── src/
│   ├── components/
│   │   ├── Game/
│   │   ├── UI/
│   │   └── Sprites/
│   ├── systems/
│   │   ├── DungeonGenerator.ts
│   │   ├── CombatSystem.ts
│   │   └── InventorySystem.ts
│   ├── assets/
│   │   ├── sprites/
│   │   ├── sounds/
│   │   └── fonts/
│   └── utils/
├── public/
└── package.json
```

## Asset Requirements

### Sprite Specifications
- **Resolution:** 64x64 pixels for characters, 32x32 for tiles
- **Format:** PNG with transparency
- **Style:** Consistent pixel art aesthetic
- **Animation:** 4-frame walk cycles for characters

### Required Sprites
1. **Environment:**
   - Stone wall tiles (various configurations)
   - Floor tiles (stone, dirt)
   - Door sprites (open/closed)
   - Torch sprites (animated flame)
   - Stairs (up/down)

2. **Characters:**
   - Player character (4 directions, idle + walk)
   - Enemy sprites (5 types, multiple frames)

3. **Items:**
   - Weapons (sword, axe, bow, staff)
   - Armor pieces (helmet, chest, boots)
   - Consumables (potions, food)
   - Treasure (coins, gems, chests)

4. **UI Elements:**
   - Inventory grid background
   - Health/mana bars
   - Button styles
   - Icons (attack, defend, use item)

## User Interface Design

### Layout Structure
- **Game View:** Central 80% of screen showing dungeon
- **Inventory Panel:** Right sidebar (20% width)
- **Status Bar:** Top bar showing health, level, score
- **Action Panel:** Bottom bar with action buttons

### Modern UI Features
- **Responsive Design:** Adapts to different screen sizes
- **Touch Support:** Mobile-friendly controls
- **Smooth Animations:** CSS transitions for all interactions
- **Visual Feedback:** Hover states, click animations
- **Accessibility:** Keyboard navigation, screen reader support

### Control Scheme
- **Desktop:** WASD or arrow keys for movement, mouse for inventory
- **Mobile:** Touch controls with virtual D-pad
- **Universal:** Spacebar for wait/skip turn, Enter for confirm

## Audio Design

### Sound Categories
- **Ambient:** Dungeon atmosphere, torch crackling
- **Movement:** Footsteps on stone
- **Combat:** Weapon swings, impact sounds
- **UI:** Button clicks, inventory sounds
- **Music:** Dark atmospheric background track

## Progression Systems

### Character Advancement
- **Experience Points:** Gained from defeating enemies
- **Level Up:** Increases health and stats
- **Skill Points:** Unlock new abilities

### Meta-Progression
- **Unlockables:** New starting equipment options
- **Achievements:** Milestone rewards
- **Leaderboard:** High score tracking

## Deployment Strategy

### Development Phases
1. **Core Mechanics:** Movement, basic combat, inventory
2. **Dungeon Generation:** Procedural level creation
3. **Enemy AI:** Behavior systems for different enemy types
4. **UI Polish:** Modern interface implementation
5. **Asset Integration:** All sprites and audio
6. **Testing & Optimization:** Performance and bug fixes
7. **Deployment:** Public web hosting

### Success Metrics
- **Engagement:** Average session length > 10 minutes
- **Retention:** 30% of players return within 24 hours
- **Performance:** 95% of sessions run without technical issues
- **Accessibility:** Playable on mobile and desktop devices

