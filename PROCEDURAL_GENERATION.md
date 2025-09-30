# Procedural Content Generation System

## 🎲 Overview
A comprehensive procedural generation system that creates unique weapons, enemy names, and dungeon themes for infinite replayability.

## ✨ Features

### 1. **Dungeon Themes** 🏰

Five unique dungeon themes that change based on level:

#### Stone Dungeon (Levels 1-2)
- **Description**: Ancient stone corridors filled with undead
- **Enemies**: Skeletons, Goblins, Golems
- **Colors**: Gray stone walls, dark floors
- **Difficulty**: Base (1.0x)
- **Loot**: Base (1.0x)

#### Frozen Caverns (Levels 3-6)
- **Description**: Icy caves inhabited by frost creatures
- **Enemies**: Goblins, Wraiths, Golems
- **Colors**: Cyan and ice blue
- **Difficulty**: 1.1x harder
- **Loot**: 1.2x better
- **Enemy Prefixes**: Frozen, Icy, Frostbitten, Glacial, Arctic

#### Molten Depths (Levels 7-9)
- **Description**: Scorching tunnels near the earth's core
- **Enemies**: Golems, Wraiths, Dragons
- **Colors**: Red, orange, lava glow
- **Difficulty**: 1.3x harder
- **Loot**: 1.5x better
- **Enemy Prefixes**: Molten, Burning, Infernal, Charred, Volcanic

#### Shadow Crypt (Levels 8-10)
- **Description**: Dark crypts filled with malevolent spirits
- **Enemies**: Wraiths, Skeletons, Bosses
- **Colors**: Deep purple, dark shadows
- **Difficulty**: 1.2x harder
- **Loot**: 1.3x better
- **Enemy Prefixes**: Shadow, Corrupted, Void, Spectral, Ethereal

#### Cursed Grove (Levels 5-7)
- **Description**: A twisted forest where nature turned dark
- **Enemies**: Goblins, Wraiths, Golems
- **Colors**: Dark green with eerie glow
- **Difficulty**: 1.15x harder
- **Loot**: 1.1x better
- **Enemy Prefixes**: Twisted, Tainted, Blighted, Venomous, Wild

---

## 🗡️ Procedural Weapons

### Rarity System

Weapons are generated with 5 rarity tiers:

| Rarity     | Color  | Chance (Base) | Level Bonus | Stat Multiplier |
|------------|--------|---------------|-------------|-----------------|
| Common     | Gray   | 40%           | -           | 1.0x            |
| Uncommon   | Green  | 30%           | -           | 1.2x            |
| Rare       | Blue   | 20%           | +2% /level  | 1.6x            |
| Epic       | Purple | 8%            | +1% /level  | 2.2x            |
| Legendary  | Gold   | 2%            | +0.5% /level| 3.0x            |

### Weapon Generation Formula

```javascript
// Base stats scale with dungeon level
baseAttack = 10 + (dungeonLevel * 3)
attack = (baseAttack ± variance) * rarityMultiplier

baseDefense = floor(dungeonLevel * 0.5)
defense = baseDefense * rarityMultiplier * randomFactor

value = (attack * 10 + defense * 15) * rarityMultiplier
```

### Naming System

Weapons are named using a 3-part system:

**[Prefix] [Weapon Type] [Suffix]**

Examples:
- **Common**: "Rusty Sword", "Worn Axe"
- **Uncommon**: "Steel Blade of Power"
- **Rare**: "Enchanted Mace of the Bear"
- **Epic**: "Ancient Hammer of Destruction"
- **Legendary**: "Eternal Spear World Ender"

### Theme-Based Variants

Weapons can have theme-specific modifiers:
- **Ice Cave**: " of Frost"
- **Lava Pit**: " of Flames"
- **Shadow Crypt**: " of Shadows"
- **Cursed Forest**: " of Thorns"

### Visual Indicators

Procedural weapons display:
- ✨ **Rarity color** on border and glow
- ⚡ **Colored lightning** icon
- 🔮 **Pulsing corner** indicator
- 📜 **Full description** in tooltip

---

## 👹 Enemy Name Generator

### Name Structure

Enemies receive unique names based on type and theme:

**[Theme Prefix] [Title] [Name] [Suffix]**

### Enemy Types & Names

#### Skeletons
- **Titles**: Captain, Knight, Lord, King, Champion
- **Names**: Bones, Rattles, Grim, Gravelord, Marrow
- **Suffixes**: the Fallen, the Defiler, the Undying

Example: "Frozen Captain Grim the Eternal"

#### Goblins
- **Titles**: Chief, Shaman, Warlord, Elder
- **Names**: Grik, Snot, Grix, Zog, Brak
- **Suffixes**: the Vile, the Sneaky, Backstabber

Example: "Arctic Chief Zog Poisontongue"

#### Golems
- **Titles**: Elder, Ancient, Titan, Prime
- **Names**: Ironhide, Stonewall, Boulder, Granite
- **Suffixes**: the Unbreakable, the Colossus, Guardian

Example: "Molten Titan Obsidian the Immovable"

#### Wraiths
- **Titles**: Phantom, Specter, Spirit, Shade
- **Names**: Whisper, Echo, Dusk, Gloom
- **Suffixes**: of Sorrow, of Despair, the Haunting

Example: "Shadow Phantom Whisper of Dread"

#### Bosses
- **Titles**: Lord, King, Overlord, Master, Emperor
- **Names**: Darkness, Doom, Death, Terror
- **Suffixes**: the Destroyer, the Devourer, the Merciless

Example: "King Terror the Immortal"

### Theme Integration

Enemies in themed dungeons have a 40% chance to receive a theme prefix:
- **Ice Cave**: Frozen, Icy, Glacial
- **Lava Pit**: Molten, Burning, Infernal
- **Shadow Crypt**: Shadow, Corrupted, Void
- **Cursed Forest**: Twisted, Tainted, Blighted

---

## 🎮 Implementation Details

### Code Structure

```javascript
// ProceduralGenerator.js
├── DUNGEON_THEMES          // Theme definitions
├── selectDungeonTheme()    // Level-based theme selection
├── generateEnemyName()     // Enemy name generation
├── generateRandomWeapon()  // Weapon generation
├── generateWeaponLoot()    // Multiple weapons
├── applyThemeMultipliers() // Theme stat adjustments
└── SeededRandom            // Deterministic RNG
```

### Integration Points

#### Game.jsx
```javascript
// Theme selection on dungeon generation
const theme = selectDungeonTheme(level);
setDungeonTheme(theme);

// Enemy name generation
const generatedName = generateEnemyName(enemyType, theme);

// Chest loot with procedural weapons
const proceduralWeapons = generateWeaponLoot(dungeonLevel, 1, dungeonTheme);
```

#### Enemy Creation
```javascript
// Apply theme multipliers
const themedStats = applyThemeMultipliers(baseStats, theme);
enemy.attack = themedStats.attack;
enemy.defense = themedStats.defense;
```

#### Chest Loot
```javascript
// 50% chance for procedural weapon
if (Math.random() < 0.5) {
  const weapon = generateRandomWeapon(dungeonLevel, theme);
  addToInventory(weapon);
}
```

---

## 📊 Balancing

### Progression Curve

| Level | Theme           | Enemy Mult. | Loot Mult. | Avg Weapon |
|-------|-----------------|-------------|------------|------------|
| 1-2   | Stone Dungeon   | 1.0x        | 1.0x       | 13 ATK     |
| 3-4   | Ice Cave        | 1.1x        | 1.2x       | 20 ATK     |
| 5-6   | Cursed Forest   | 1.15x       | 1.1x       | 28 ATK     |
| 7-8   | Lava Pit        | 1.3x        | 1.5x       | 38 ATK     |
| 9-10  | Shadow Crypt    | 1.2x        | 1.3x       | 45 ATK     |

### Loot Distribution

- **Common**: 40% (always available)
- **Uncommon**: 30% (slight power boost)
- **Rare**: 20% + level scaling (noticeable upgrade)
- **Epic**: 8% + level scaling (rare find)
- **Legendary**: 2% + level scaling (very rare, huge power spike)

### Theme Difficulty Scaling

Harder themes offer better loot:
```
Molten Depths: +30% difficulty, +50% loot
Shadow Crypt: +20% difficulty, +30% loot
Cursed Forest: +15% difficulty, +10% loot
Ice Cave: +10% difficulty, +20% loot
Stone Dungeon: Base difficulty, base loot
```

---

## 🎨 Visual Design

### UI Elements

1. **Dungeon Level Indicator**
   - Shows theme name below level
   - Theme-colored accent border
   - Color-matched glow effect

2. **Procedural Weapon Display**
   - Rarity-colored border
   - Pulsing corner indicator
   - Colored lightning icon
   - Enhanced tooltip

3. **Enemy Names**
   - Display in battle interface
   - Theme prefix highlighted
   - Unique names per encounter

---

## 🔮 Future Enhancements

Potential additions to the system:

1. **Armor Generation**: Procedural armor pieces
2. **Stat Modifiers**: Special attributes (Lifesteal, Critical, Fire Damage)
3. **Set Items**: Themed equipment sets with bonuses
4. **Curse Effects**: Powerful but risky items
5. **Enchantment System**: Modify existing items
6. **Daily Seeds**: Shared daily dungeons
7. **More Themes**: Desert Ruins, Crystal Caves, Underwater Grotto
8. **Weapon Types**: Bows, Staffs, Shields
9. **Relic Items**: Super rare unique items
10. **Crafting**: Combine materials to create custom items

---

## 📝 Technical Notes

### Performance

- **Generation Speed**: < 1ms per weapon
- **Memory**: ~200 bytes per generated item
- **Caching**: None needed, regenerated on demand

### Randomness

- Uses `Math.random()` for unpredictability
- `SeededRandom` class available for reproducibility
- No two generated weapons are identical (unique IDs)

### Data Structure

```javascript
{
  id: 'proc_weapon_1234567890_abc123',
  name: 'Eternal Blade of Eternity',
  type: 'weapon',
  rarity: 'legendary',
  attack: 95,
  defense: 8,
  value: 2850,
  sprite: 'enchanted_blade.png',
  description: 'A legendary blade found in Shadow Crypt',
  procedural: true,
  rarityColor: '#f59e0b',
  dungeonLevel: 9,
  theme: 'shadow_crypt'
}
```

---

## 🎯 Benefits

### For Players
- ✅ **Infinite Variety**: Never see the same weapon twice
- ✅ **Exciting Loot**: Every chest could have something amazing
- ✅ **Progression**: Better weapons as you progress
- ✅ **Theme Immersion**: Weapons match dungeon atmosphere

### For Developers
- ✅ **Less Manual Content**: No need to hand-create hundreds of items
- ✅ **Easy Balancing**: Adjust formulas instead of individual items
- ✅ **Scalable**: Add new themes/types easily
- ✅ **Replayability**: Generates unique content each playthrough

### For Portfolio
- ✅ **Shows algorithmic thinking**: Complex generation system
- ✅ **Demonstrates game design**: Balanced progression curves
- ✅ **Code organization**: Modular, reusable system
- ✅ **Advanced features**: Theme integration, rarity tiers
- ✅ **Player engagement**: Addictive loot system

---

## 🚀 Usage Example

```javascript
import { 
  selectDungeonTheme, 
  generateRandomWeapon,
  generateEnemyName 
} from './ProceduralGenerator';

// Select theme for level 5
const theme = selectDungeonTheme(5);
console.log(theme.name); // "Cursed Grove"

// Generate a weapon
const weapon = generateRandomWeapon(5, theme);
console.log(weapon.name); // "Blessed Axe of Thorns"
console.log(weapon.attack); // 42

// Generate enemy name
const name = generateEnemyName('goblin', theme);
console.log(name); // "Blighted Chief Grik Backstabber"
```

---

## 📚 References

- [Diablo's Loot System](https://www.diablowiki.net/Item_Generation)
- [Procedural Generation in Games](https://en.wikipedia.org/wiki/Procedural_generation)
- [Roguelike Development](https://www.roguebasin.com/index.php?title=Articles)

---

*Generated content brings endless possibilities! 🎲✨*
