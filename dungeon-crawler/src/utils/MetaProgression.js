// Simple localStorage-backed meta-progression system
// Persists across runs: currency (Eternal Souls) and unlock flags

const STORAGE_KEY = 'dc_meta_progression_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { souls: 0, unlocks: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { souls: 0, unlocks: {} };
    return {
      souls: Number.isFinite(parsed.souls) ? parsed.souls : 0,
      unlocks: parsed.unlocks && typeof parsed.unlocks === 'object' ? parsed.unlocks : {}
    };
  } catch (e) {
    return { souls: 0, unlocks: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {
    // ignore
  }
}

export function getSouls() {
  return loadState().souls;
}

export function addSouls(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return getSouls();
  const state = loadState();
  state.souls = Math.max(0, Math.floor(state.souls + amount));
  saveState(state);
  return state.souls;
}

export function spendSouls(amount) {
  const state = loadState();
  const cost = Math.max(0, Math.floor(amount || 0));
  if (state.souls < cost) return { success: false, souls: state.souls };
  state.souls -= cost;
  saveState(state);
  return { success: true, souls: state.souls };
}

export function getUnlocks() {
  return loadState().unlocks;
}

export function isUnlocked(key) {
  const unlocks = getUnlocks();
  return Boolean(unlocks[key]);
}

export function unlock(key) {
  const state = loadState();
  if (!state.unlocks[key]) {
    state.unlocks[key] = true;
    saveState(state);
  }
  return true;
}

// Calculate run rewards; scales mainly with depth, with bonuses
export function calculateSoulsForRun({ depth = 1, kills = 0, victory = false }) {
  const safeDepth = Math.max(1, Math.floor(depth));
  const base = 5 * safeDepth; // 5 souls per floor reached
  const killBonus = Math.floor(kills * 0.5); // 0.5 per kill
  const victoryBonus = victory ? 25 * safeDepth : 0; // big bonus for clear
  return Math.max(0, base + killBonus + victoryBonus);
}

export function grantSoulsForRun(params) {
  const amount = calculateSoulsForRun(params);
  return addSouls(amount);
}

// Suggested upgrade catalog (id, name, cost, apply function)
export const META_UPGRADES = [
  { id: 'stat_boost_1', name: '+5% base stats', cost: 50 },
  { id: 'better_starting_gear', name: 'Better starting gear', cost: 80 },
  { id: 'unlock_biome_frost', name: 'Unlock Frost Biome', cost: 60 },
  { id: 'unlock_biome_crypt', name: 'Unlock Crypt Biome', cost: 60 },
];

export function canPurchaseUpgrade(upgradeId) {
  const upgrade = META_UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return false;
  if (isUnlocked(upgradeId)) return false;
  return getSouls() >= upgrade.cost;
}

export function purchaseUpgrade(upgradeId) {
  const upgrade = META_UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade) return { success: false, reason: 'not_found' };
  if (isUnlocked(upgradeId)) return { success: false, reason: 'already_unlocked' };
  const result = spendSouls(upgrade.cost);
  if (!result.success) return { success: false, reason: 'insufficient_funds' };
  unlock(upgradeId);
  return { success: true, souls: result.souls };
}

// Read-only helpers for other systems
export function getMetaPlayerModifiers() {
  // Aggregate permanent upgrades into passive modifiers applied at run start
  const unlocks = getUnlocks();
  const modifiers = {
    baseStatMultiplier: 1.0,
    startingGearTier: 0,
    unlockedBiomes: []
  };
  if (unlocks['stat_boost_1']) modifiers.baseStatMultiplier *= 1.05;
  if (unlocks['better_starting_gear']) modifiers.startingGearTier = Math.max(modifiers.startingGearTier, 1);
  if (unlocks['unlock_biome_frost']) modifiers.unlockedBiomes.push('frost');
  if (unlocks['unlock_biome_crypt']) modifiers.unlockedBiomes.push('crypt');
  return modifiers;
}


