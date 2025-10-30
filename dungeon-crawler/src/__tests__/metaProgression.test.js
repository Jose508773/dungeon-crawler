import { calculateSoulsForRun } from '../utils/MetaProgression';

describe('MetaProgression', () => {
  test('calculates souls scaling with depth', () => {
    const a = calculateSoulsForRun({ depth: 1, kills: 0, victory: false });
    const b = calculateSoulsForRun({ depth: 5, kills: 0, victory: false });
    expect(b).toBeGreaterThan(a);
  });
});


