import { describe, expect, it } from 'vitest';
import { computeHistoryStats } from './historyStats';
import type { HistoryEntry } from './types';

const entry = (expression: string, result: number, createdAt: number): HistoryEntry => ({
  id: String(createdAt),
  expression,
  result,
  angleUnit: 'deg',
  createdAt,
});

describe('computeHistoryStats', () => {
  it('devuelve valores vacíos sin historial', () => {
    expect(computeHistoryStats([])).toEqual({
      total: 0,
      last: null,
      mostUsedOperation: null,
      maxResult: null,
      minResult: null,
    });
  });

  it('calcula total, última operación, operación más usada, máximo y mínimo', () => {
    const entries = [entry('2×3', 6, 3), entry('2+2', 4, 1), entry('5×(−2)', -10, 2), entry('sin(30)', 0.5, 4)];
    const stats = computeHistoryStats(entries);
    expect(stats.total).toBe(4);
    expect(stats.last?.expression).toBe('sin(30)');
    expect(stats.mostUsedOperation).toEqual({ label: 'Multiplicación', count: 2 });
    expect(stats.maxResult).toBe(6);
    expect(stats.minResult).toBe(-10);
  });
});
