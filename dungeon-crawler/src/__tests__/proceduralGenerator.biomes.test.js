import { selectDungeonTheme } from '../utils/ProceduralGenerator';

describe('ProceduralGenerator biomes', () => {
  test('respects unlocked biomes option', () => {
    const theme = selectDungeonTheme(9, { unlockedBiomes: ['crypt'] });
    expect(theme).toBeTruthy();
  });
});


