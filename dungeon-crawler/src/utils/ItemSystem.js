// Item System for Dungeon Crawler
// Defines all available items with their stats and properties

export const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  CONSUMABLE: 'consumable'
};

export const ITEM_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

// Weapon definitions
export const WEAPONS = {
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.COMMON,
    attack: 15,
    defense: 0,
    value: 50,
    sprite: 'iron_sword.png',
    description: 'A reliable iron sword',
    lore: 'Forged in the smithies of the eastern kingdoms, this simple yet sturdy blade has served countless adventurers on their first journeys into the depths. The iron was mined from the Stonefall Mountains, where generations of blacksmiths have perfected their craft. Though unremarkable in appearance, its balanced weight and sharp edge have saved many lives in desperate moments.'
  },
  shadow_dagger: {
    id: 'shadow_dagger',
    name: 'Shadow Dagger',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.UNCOMMON,
    attack: 20,
    defense: 0,
    value: 120,
    sprite: 'shadow_dagger.png',
    description: 'A swift blade that strikes from darkness',
    lore: 'Once wielded by the legendary assassin known only as "The Whisper," this dagger seems to absorb light itself. Its blade was tempered in shadow magic, allowing it to slice through the air without a sound. Many who have faced its wielder never saw the strike that ended them. The hilt bears no maker\'s mark, as if the weapon prefers to remain anonymous like its masters.'
  },
  royal_sword: {
    id: 'royal_sword',
    name: 'Royal Sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.UNCOMMON,
    attack: 25,
    defense: 2,
    value: 150,
    sprite: 'royal_sword.png',
    description: 'An ornate sword fit for nobility',
    lore: 'Commissioned by Prince Aldric III for his coronation ceremony, this magnificent blade bears the royal crest of the Thornwood Dynasty. Its pommel is adorned with sapphires, and gold filigree runs along the fuller. Though crafted for ceremony, it has seen real battle when the prince defended his castle from the goblin horde. The blade still carries enchantments placed by the court wizard for the prince\'s protection.'
  },
  enchanted_blade: {
    id: 'enchanted_blade',
    name: 'Enchanted Blade',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.RARE,
    attack: 35,
    defense: 0,
    value: 300,
    sprite: 'enchanted_blade.png',
    description: 'A blade imbued with arcane power',
    lore: 'Crafted by the Archmage Velanthor during the War of Shattered Skies, this sword pulses with barely contained magical energy. Each strike releases a spark of arcane power, and those who wield it report hearing faint whispers of ancient spells. The blade\'s edge never dulls, maintained by the perpetual enchantments woven into its very molecular structure. It is said that the sword chooses its wielder, refusing to cut for those it deems unworthy.'
  },
  frost_blade: {
    id: 'frost_blade',
    name: 'Frostbite Blade',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.RARE,
    attack: 38,
    defense: 0,
    value: 320,
    sprite: 'frost_blade.png',
    description: 'An icy sword that freezes enemies on contact',
    lore: 'Forged in the Frozen Wastes of the North by the Ice Giants, this blade is eternally cold to the touch. The metal was cooled in the breath of the frost dragon Rimefang, imbuing it with the essence of eternal winter. Warriors who wield it can feel the chill seeping into their bones, but those struck by its edge experience a far worse fate—their blood freezing in their veins. The sword leaves a trail of frost crystals in the air as it swings.'
  },
  spiked_mace: {
    id: 'spiked_mace',
    name: 'Spiked Mace',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.RARE,
    attack: 40,
    defense: 0,
    value: 350,
    sprite: 'spiked_mace.png',
    description: 'A brutal weapon with devastating spikes',
    lore: 'This fearsome weapon was the signature tool of the Skull Crushers, a mercenary company that terrorized the borderlands for decades. Each spike on its head has tasted blood, and the dark stains on the iron cannot be washed away. The weight of the mace makes it difficult to wield, but in the right hands, it can shatter shields, dent plate armor, and break bones with horrifying efficiency. Some say the weapon hungers for violence.'
  },
  battle_axe: {
    id: 'battle_axe',
    name: 'Battle Axe',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.EPIC,
    attack: 50,
    defense: 0,
    value: 600,
    sprite: 'battle_axe.png',
    description: 'A mighty axe that cleaves through enemies',
    lore: 'Bearer of countless legends, this double-bladed axe was wielded by Grommash the Unyielding during the Siege of Ironforge. The axe head is forged from meteoric iron that fell from the heavens, giving it unnatural sharpness and durability. Its haft is carved from the heartwood of an ancient oak that stood for a thousand years. Warriors who master its heavy swing can cleave through multiple foes in a single arc. The axe\'s thunderous impacts echo across battlefields.'
  },
  thunder_hammer: {
    id: 'thunder_hammer',
    name: 'Thunderstrike Hammer',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.EPIC,
    attack: 55,
    defense: 3,
    value: 700,
    sprite: 'thunder_hammer.png',
    description: 'A hammer crackling with electrical fury',
    lore: 'Blessed by the Storm God Taranis during the great tempest of the eastern seas, this war hammer channels the raw power of lightning. Each strike releases a thunderous boom that can be heard for miles, and arcs of electricity dance along its surface. The hammer was originally wielded by Thorgrim Stormborn, a paladin who defended coastal villages from sea monsters. They say that during storms, the hammer vibrates with excitement, eager to join the tempest\'s fury.'
  },
  crystal_spear: {
    id: 'crystal_spear',
    name: 'Crystal Spear',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.LEGENDARY,
    attack: 65,
    defense: 5,
    value: 1200,
    sprite: 'crystal_spear.png',
    description: 'A mystical spear infused with crystalline magic',
    lore: 'Grown rather than forged, this spear emerged from the Crystal Caverns of Lumina over the course of a century. The crystalline structure focuses and amplifies magical energy, making it deadly to creatures of darkness and shadow. The spear\'s tip can pierce through magical barriers as if they were paper, and it glows with an inner light that cannot be extinguished. Legends tell of the Spear choosing the champion of light in times of great darkness, appearing to the worthy in their moment of greatest need.'
  },
  demon_slayer: {
    id: 'demon_slayer',
    name: 'Demon Slayer',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.LEGENDARY,
    attack: 70,
    defense: 5,
    value: 1500,
    sprite: 'demon_slayer.png',
    description: 'A holy blade forged to vanquish demonic forces',
    lore: 'Forged in the sacred flames of Mount Celestia by the order of the Radiant Paladins, this blade was created for one purpose: to banish demons back to the abyss. The sword\'s metal was blessed by seven high priests and quenched in holy water from the Fountain of Purity. Inscribed along its blade are prayers in the language of angels, which glow with golden light when evil draws near. The blade burns demons on contact, their screams echoing as they are sent back to the infernal realms. Only those pure of heart can wield its full power.'
  },
  holy_hammer: {
    id: 'holy_hammer',
    name: 'Holy Warhammer',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.UNCOMMON,
    attack: 22,
    defense: 0,
    value: 140,
    sprite: 'holy_hammer.png',
    description: 'A blessed warhammer that smites evil',
    lore: 'Blessed by temple clerics and forged with sacred silver, this warhammer is a favorite among paladins who venture into cursed dungeons. The hammerhead is inscribed with holy symbols that glow faintly in the presence of undead. Its heavy strikes not only crush bone and armor but also purify tainted ground with each impact. The weapon hums with righteous power when wielded by those with good intentions.'
  },
  obsidian_blade: {
    id: 'obsidian_blade',
    name: 'Obsidian Edge',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.RARE,
    attack: 42,
    defense: 0,
    value: 380,
    sprite: 'obsidian_blade.png',
    description: 'A razor-sharp blade forged from volcanic glass',
    lore: 'Crafted from obsidian harvested from the volcanic peaks of Mount Infernus, this blade is impossibly sharp—capable of cutting through steel like parchment. The black glass reflects no light, making the blade nearly invisible in shadows. Ancient legends tell of assassins who wielded these blades, their strikes so swift and clean that victims didn\'t realize they\'d been cut until they fell. The blade never dulls, maintained by the latent volcanic energy within the obsidian.'
  },
  inferno_sword: {
    id: 'inferno_sword',
    name: 'Inferno Blade',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.EPIC,
    attack: 58,
    defense: 3,
    value: 750,
    sprite: 'inferno_sword.png',
    description: 'A blazing sword wreathed in eternal flames',
    lore: 'Forged in the heart of an active volcano and cooled in dragon fire, this sword burns with an eternal flame that cannot be extinguished. The blade radiates intense heat, causing the air around it to shimmer and waver. Warriors who wield it report feeling the fire\'s warmth coursing through their veins, filling them with burning determination. The Inferno Blade leaves trails of fire with each swing, and its strikes can ignite flammable materials on contact. Only those with the strength to master its fury can hope to wield it effectively.'
  },
  void_scythe: {
    id: 'void_scythe',
    name: 'Void Reaper',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.LEGENDARY,
    attack: 75,
    defense: 0,
    value: 1600,
    sprite: 'void_scythe.png',
    description: 'A cursed scythe that harvests souls from the void',
    lore: 'This otherworldly weapon was pulled from the void between dimensions by a mad sorcerer seeking ultimate power. The scythe\'s blade appears to be made of solidified darkness, and looking at it for too long causes vertigo as if staring into an endless abyss. It doesn\'t cut flesh so much as it severs the connection between body and soul. Those killed by the Void Reaper are said to be trapped in the void forever, unable to find peace. The weapon whispers dark promises to its wielder, slowly corrupting even the strongest wills. Great power comes at a terrible price.'
  },
  celestial_blade: {
    id: 'celestial_blade',
    name: 'Celestial Sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.LEGENDARY,
    attack: 68,
    defense: 7,
    value: 1400,
    sprite: 'celestial_blade.png',
    description: 'A divine sword blessed by the heavens above',
    lore: 'This magnificent blade fell from the heavens during a meteor shower, embedded in a stone at the site of an ancient temple. Crafted from star metal and imbued with celestial blessings, the sword glows with a soft azure light that intensifies in darkness. The blade is perfectly balanced and impossibly light, allowing even novice warriors to wield it with grace. Angels are said to guide the hand of whoever wields this weapon in righteous battle. Evil creatures recoil from its holy radiance, and those pure of heart find their strength doubled when holding it.'
  },
  arcane_staff: {
    id: 'arcane_staff',
    name: 'Arcane Scepter',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.EPIC,
    attack: 52,
    defense: 5,
    value: 680,
    sprite: 'arcane_staff.png',
    description: 'A mystical staff crackling with raw magical energy',
    lore: 'Carved from the heartwood of the ancient World Tree and crowned with a crystal that captures pure magical essence, this staff is a channeling focus of immense power. Archmages of the Eternal Sanctum spend decades mastering the use of such artifacts. The staff amplifies magical abilities, allowing spells to be cast with greater precision and power. Runes along its length pulse with arcane energy, and the crystal at its tip shifts colors based on the ambient magical forces. In battle, it can unleash devastating magical strikes that pierce through conventional defenses.'
  }
};

// Armor definitions
export const ARMOR = {
  leather_armor: {
    id: 'leather_armor',
    name: 'Leather Armor',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.COMMON,
    attack: 0,
    defense: 5,
    value: 40,
    sprite: 'leather_armor.png',
    description: 'Basic leather protection',
    lore: 'Tanned from the hides of giant boars from the Wildwood Forest, this armor provides basic protection without sacrificing mobility. Every adventurer starts with something like this—lightweight, affordable, and surprisingly durable. The leather has been treated with oils to resist water and maintain flexibility. While it won\'t stop a direct sword strike, it has saved countless lives from glancing blows, arrow scratches, and creature bites. Many veteran warriors keep their first leather armor as a reminder of humble beginnings.'
  },
  chain_mail: {
    id: 'chain_mail',
    name: 'Chain Mail',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.UNCOMMON,
    attack: 0,
    defense: 12,
    value: 150,
    sprite: 'chain_mail.png',
    description: 'Flexible metal armor of interlocking rings',
    lore: 'Each ring was hand-forged and linked by master armorers of the Ironhall Guild, requiring weeks of meticulous work. The interlocking steel rings distribute the force of impacts across the entire garment, making it effective against slashing weapons while remaining flexible enough for movement. Knights and soldiers alike favor chain mail for its balance of protection and mobility. The soft padding worn underneath prevents the rings from chafing. The distinctive jingling sound of chain mail has become synonymous with martial readiness.'
  },
  plate_armor: {
    id: 'plate_armor',
    name: 'Plate Armor',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.RARE,
    attack: 0,
    defense: 20,
    value: 400,
    sprite: 'plate_armor.png',
    description: 'Heavy plate armor that deflects most attacks',
    lore: 'A masterwork of metallurgy and engineering, this full suit of plate armor transforms its wearer into a walking fortress. Forged from high-carbon steel in the legendary forges of Ironpeak, each piece is custom-fitted to allow surprising freedom of movement. The surface is polished to a mirror shine, causing blades to glance off rather than bite. While heavy and expensive, plate armor has turned many would-be fatal blows into mere bruises. Knights in plate armor have been known to walk through arrow storms unscathed, their armor singing with deflected projectiles.'
  },
  dragon_scale_armor: {
    id: 'dragon_scale_armor',
    name: 'Dragon Scale Armor',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.RARE,
    attack: 0,
    defense: 22,
    value: 500,
    sprite: 'dragon_scale_armor.png',
    description: 'Armor crafted from genuine dragon scales',
    lore: 'Harvested from the crimson dragon Infernus after his fall at the Battle of Ashencrag, these scales retain their supernatural resilience. Each scale is harder than steel yet lighter than leather, and they shimmer with an inner fire. The scales naturally resist heat and flame, making the wearer nearly immune to fire-based attacks. Dragon scale armor is a badge of honor, marking its wearer as someone who has faced—and survived—an encounter with dragonkind. The scales sometimes warm to the touch when danger is near.'
  },
  magic_robe: {
    id: 'magic_robe',
    name: 'Enchanted Robe',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.EPIC,
    attack: 0,
    defense: 25,
    value: 600,
    sprite: 'magic_robe.png',
    description: 'A robe woven with protective enchantments',
    lore: 'Woven from threads spun by the Silkspinners of the Ethereal Plane, this robe is lighter than air yet stronger than steel. Every thread is inscribed with microscopic runes of protection, creating a web of magical wards. The robe shifts colors based on the ambient magical energies, sometimes shimmering with aurora-like patterns. It protects not just against physical harm, but also magical attacks, deflecting spells and curses. Wizards and sorcerers prize these robes above all other armor, as they provide protection without hindering spellcasting.'
  },
  divine_armor: {
    id: 'divine_armor',
    name: 'Divine Armor',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.LEGENDARY,
    attack: 0,
    defense: 35,
    value: 1200,
    sprite: 'divine_armor.png',
    description: 'Holy armor blessed by celestial beings',
    lore: 'Bestowed upon the Chosen Champions by the gods themselves, this armor radiates divine power. Crafted in the Celestial Forge, it was cooled in the tears of angels and blessed by the light of a thousand prayers. The armor glows with a soft golden light that intensifies in the presence of evil, and undead creatures recoil from its holy presence. It repairs itself when damaged and never tarnishes or degrades. Only those deemed worthy by the divine can wear it—others find it unbearably heavy. Legends say wearing this armor grants the protection of the gods themselves.'
  },
  mystic_shield: {
    id: 'mystic_shield',
    name: 'Mystic Shield',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.UNCOMMON,
    attack: 0,
    defense: 10,
    value: 130,
    sprite: 'mystic_shield.png',
    description: 'A shield imbued with protective magic',
    lore: 'Created by the Shield Mages of the Arcane Tower, this shield bears enchantments that create a magical barrier upon impact. The shield\'s surface shows swirling patterns that shift and change, mesmerizing those who stare too long. It\'s lighter than it appears and can deflect not just physical attacks but also minor magical projectiles. Warriors who bear this shield report feeling a protective presence watching over them in battle.'
  },
  guardian_plate: {
    id: 'guardian_plate',
    name: 'Guardian Plate',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.RARE,
    attack: 0,
    defense: 18,
    value: 420,
    sprite: 'guardian_plate.png',
    description: 'Heavy armor worn by royal guardians',
    lore: 'This impressive suit of armor was commissioned for the elite Royal Guard who protect the throne. Made from reinforced steel and decorated with the kingdom\'s emblems, it represents both martial prowess and unwavering loyalty. The armor is designed to withstand prolonged combat, with reinforced joints and overlapping plates. Those who wear the Guardian Plate carry the weight of their duty to protect the innocent and uphold justice. It has been passed down through generations of guardians, each adding their own mark of honor.'
  },
  runic_armor: {
    id: 'runic_armor',
    name: 'Runic Battlegear',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.EPIC,
    attack: 0,
    defense: 28,
    value: 650,
    sprite: 'runic_armor.png',
    description: 'Ancient armor inscribed with powerful runes',
    lore: 'Forged by the legendary Runesmiths of the northern clans, every inch of this armor is covered in intricate runic inscriptions. Each rune channels a different protective magic—some deflect blows, others absorb impacts, and a few even heal minor wounds. The armor glows faintly when its protective magic activates, creating a shimmering barrier around the wearer. It took master craftsmen years to complete, and the knowledge of creating such armor has been lost to time. Warriors who wear it feel connected to the ancient heroes who wore similar gear in ages past.'
  },
  shadow_cloak: {
    id: 'shadow_cloak',
    name: 'Shadow Cloak',
    type: ITEM_TYPES.ARMOR,
    rarity: ITEM_RARITY.RARE,
    attack: 0,
    defense: 15,
    value: 380,
    sprite: 'shadow_cloak.png',
    description: 'A mysterious cloak that bends shadows around its wearer',
    lore: 'Woven from threads that absorbed the essence of shadows, this cloak makes its wearer harder to detect and strike. It seems to shift and flow like liquid darkness, and those who wear it report feeling as if they\'re wrapped in the night itself. The cloak doesn\'t make the wearer invisible, but it causes enemies to hesitate and misjudge their attacks. Rogues and assassins prize these cloaks for their ability to blend into darkness. Some say the cloak has a mind of its own, whispering secrets of the shadows to those brave enough to listen.'
  }
};

// Consumable definitions
export const CONSUMABLES = {
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: ITEM_RARITY.COMMON,
    health: 50,
    value: 25,
    sprite: 'health_potion.png',
    description: 'Restores 50 health points',
    lore: 'Brewed by alchemists across the realm, this crimson liquid is a staple of every adventurer\'s pack. The potion contains essence of trollblood, which promotes rapid tissue regeneration, mixed with healing herbs from the Verdant Vale. While the taste is notoriously bitter, its life-saving properties are undeniable. Countless warriors have survived mortal wounds by drinking these potions in the heat of battle. The glass vial is specially treated to preserve the potion\'s potency for years.'
  },
  greater_health_potion: {
    id: 'greater_health_potion',
    name: 'Greater Health Potion',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: ITEM_RARITY.UNCOMMON,
    health: 100,
    value: 60,
    sprite: 'health_potion.png',
    description: 'Restores 100 health points',
    lore: 'An improved formula developed by the Alchemist Guild, this potion contains twice the concentration of healing reagents. The base is enriched with phoenix tears, extremely rare and difficult to obtain. The deep ruby color seems to swirl with internal motion, and it radiates warmth even through the glass. Master alchemists can spend weeks crafting a single batch of these potions. Warriors facing the most dangerous dungeons always carry several of these lifesavers.'
  },
  elixir_of_life: {
    id: 'elixir_of_life',
    name: 'Elixir of Life',
    type: ITEM_TYPES.CONSUMABLE,
    rarity: ITEM_RARITY.RARE,
    health: 200,
    value: 150,
    sprite: 'health_potion.png',
    description: 'Fully restores health and vitality',
    lore: 'This legendary concoction is said to have been a gift from the Goddess of Healing herself. The elixir glows with a soft golden light and is warm to the touch. Its formula is a closely guarded secret, requiring ingredients from the far corners of the world—unicorn horn dust, water from the Eternal Spring, and petals from the Moonflower that blooms once a century. Drinking it not only heals all wounds but also restores vitality and cleanses toxins. Some claim it can even bring those at death\'s door back to full health in mere moments.'
  }
};

// All items combined
export const ALL_ITEMS = {
  ...WEAPONS,
  ...ARMOR,
  ...CONSUMABLES
};

// Get item by ID
export const getItemById = (id) => {
  return ALL_ITEMS[id] || null;
};

// Get random item by type and rarity
export const getRandomItem = (type = null, rarity = null) => {
  let availableItems = Object.values(ALL_ITEMS);
  
  if (type) {
    availableItems = availableItems.filter(item => item.type === type);
  }
  
  if (rarity) {
    availableItems = availableItems.filter(item => item.rarity === rarity);
  }
  
  if (availableItems.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableItems.length);
  return availableItems[randomIndex];
};

// Get chest loot based on dungeon level
export const getChestLoot = (dungeonLevel) => {
  const loot = [];
  
  // Gold (always present)
  const goldAmount = Math.floor(Math.random() * (50 + dungeonLevel * 25)) + (25 + dungeonLevel * 10);
  loot.push({ type: 'gold', amount: goldAmount });
  
  // Determine item rarity based on dungeon level
  let rarityChance = Math.random();
  let itemRarity = ITEM_RARITY.COMMON;
  
  if (dungeonLevel >= 5 && rarityChance < 0.1) {
    itemRarity = ITEM_RARITY.LEGENDARY;
  } else if (dungeonLevel >= 4 && rarityChance < 0.2) {
    itemRarity = ITEM_RARITY.EPIC;
  } else if (dungeonLevel >= 3 && rarityChance < 0.4) {
    itemRarity = ITEM_RARITY.RARE;
  } else if (dungeonLevel >= 2 && rarityChance < 0.6) {
    itemRarity = ITEM_RARITY.UNCOMMON;
  }
  
  // 70% chance to get an item
  if (Math.random() < 0.7) {
    const itemType = Math.random() < 0.6 ? ITEM_TYPES.WEAPON : ITEM_TYPES.ARMOR;
    const item = getRandomItem(itemType, itemRarity);
    
    if (item) {
      loot.push({ type: 'item', item: item });
    }
  }
  
  // 30% chance to get a consumable
  if (Math.random() < 0.3) {
    const consumable = getRandomItem(ITEM_TYPES.CONSUMABLE);
    if (consumable) {
      loot.push({ type: 'item', item: consumable });
    }
  }
  
  return loot;
};

// Apply item stats to player
export const applyItemStats = (player, item) => {
  if (item.type === ITEM_TYPES.WEAPON) {
    player.attack += item.attack;
  } else if (item.type === ITEM_TYPES.ARMOR) {
    player.defense += item.defense;
  }
  return player;
};

// Remove item stats from player
export const removeItemStats = (player, item) => {
  if (item.type === ITEM_TYPES.WEAPON) {
    player.attack -= item.attack;
  } else if (item.type === ITEM_TYPES.ARMOR) {
    player.defense -= item.defense;
  }
  return player;
};
