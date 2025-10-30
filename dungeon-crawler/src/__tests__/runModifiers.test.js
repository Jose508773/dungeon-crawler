import { rollRunModifiers, applyRunModifiers } from '../utils/RunModifiers';

describe('RunModifiers', () => {
  test('rolls at least one modifier', () => {
    const mods = rollRunModifiers(2);
    expect(mods.length).toBeGreaterThan(0);
  });

  test('applies modifiers without throwing', () => {
    const mods = rollRunModifiers(2);
    const player = { attack: 10, defense: 2, maxHealth: 100, health: 100 };
    const updated = applyRunModifiers(player, mods);
    expect(updated).toBeTruthy();
  });
});


