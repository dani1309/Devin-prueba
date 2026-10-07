import { describe, expect, it } from 'vitest';
import { parseNumberInput } from './numberInput';

describe('parseNumberInput', () => {
  it.each([
    ['12', 12],
    ['12.5', 12.5],
    ['12,5', 12.5],
    ['-3', -3],
    ['.5', 0.5],
    [' 1 000 ', 1000],
  ])('%s → %s', (input, expected) => {
    expect(parseNumberInput(input)).toEqual({ ok: true, value: expected });
  });

  it.each(['', 'abc', '1.2.3', '--2', '1e5'])('rechaza "%s"', (input) => {
    expect(parseNumberInput(input).ok).toBe(false);
  });
});
