import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BattleInterface from '../BattleInterface';

const basePlayer = { health: 100, maxHealth: 100, level: 1 };
const baseEnemy = { name: 'Skeleton', health: 30, maxHealth: 30, sprite: null };

describe('BattleInterface', () => {
  it('renders HP bars and buttons', () => {
    render(
      <BattleInterface
        player={basePlayer}
        enemy={baseEnemy}
        inventory={{ items: [] }}
        playerTurn
        onAttack={() => {}}
        onUseItem={() => {}}
        onRun={() => {}}
      />
    );
    expect(screen.getByTestId('enemy-hp-label')).toHaveTextContent('HP');
    expect(screen.getByTestId('player-hp-label')).toHaveTextContent('HP');
    expect(screen.getByTestId('btn-attack-enabled')).toBeInTheDocument();
    expect(screen.getByTestId('btn-run-enabled')).toBeInTheDocument();
  });

  it('disables actions when not player turn', async () => {
    const user = userEvent.setup();
    const onAttack = vi.fn();
    render(
      <BattleInterface
        player={basePlayer}
        enemy={baseEnemy}
        inventory={{ items: [] }}
        playerTurn={false}
        onAttack={onAttack}
        onUseItem={() => {}}
        onRun={() => {}}
      />
    );
    const btn = screen.getByTestId('btn-attack-disabled');
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onAttack).not.toHaveBeenCalled();
  });
});


