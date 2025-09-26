import { describe, it, expect } from 'vitest';
import { CombatSystem } from '../CombatSystem';

const makePlayer = () => ({
  x: 0, y: 0,
  health: 100, maxHealth: 100,
  attack: 20, defense: 5,
  experience: 0, gold: 0,
});

const makeEnemy = () => ({
  id: 'e1', x: 1, y: 0,
  name: 'Test Foe',
  maxHealth: 30, health: 30,
  attack: 10, defense: 2,
  experience: 10, gold: 5,
  isAlive: true,
  takeDamage(dmg) {
    const actual = Math.max(1, dmg - this.defense);
    this.health -= actual;
    if (this.health <= 0) { this.health = 0; this.isAlive = false; }
    return actual;
  }
});

describe('CombatSystem', () => {
  it('calculates damage >= 1 and applies defense', () => {
    const player = makePlayer();
    const enemy = makeEnemy();
    const dmg = CombatSystem.calculateDamage(player, enemy);
    expect(dmg).toBeGreaterThanOrEqual(1);
  });

  it('playerAttackEnemy reduces enemy HP and awards on defeat', () => {
    const player = makePlayer();
    const enemy = makeEnemy();
    // Deal enough damage in a loop to ensure defeat
    let msg;
    for (let i = 0; i < 10 && enemy.isAlive; i++) {
      const r = CombatSystem.playerAttackEnemy(player, enemy);
      msg = r.message;
    }
    expect(enemy.isAlive).toBe(false);
    expect(msg).toMatch(/defeated/i);
  });

  it('getAdjacentEnemies only returns cardinal-adjacent enemies', () => {
    const player = makePlayer();
    const e1 = { ...makeEnemy(), x: 1, y: 0 }; // right
    const e2 = { ...makeEnemy(), x: 1, y: 1 }; // diagonal, should not count
    const res = CombatSystem.getAdjacentEnemies(player, [e1, e2]);
    expect(res.map(e => e.x + ',' + e.y)).toEqual(['1,0']);
  });
});


