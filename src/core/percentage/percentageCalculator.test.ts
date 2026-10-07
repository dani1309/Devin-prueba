import { describe, expect, it } from 'vitest';
import { calculatePercentage } from './percentageCalculator';

const valueOf = (result: ReturnType<typeof calculatePercentage>) => (result.ok ? result.value : NaN);

describe('calculatePercentage', () => {
  it('20% de 500 = 100', () => expect(valueOf(calculatePercentage('percentOf', 20, 500))).toBe(100));
  it('500 + 20% = 600', () => expect(valueOf(calculatePercentage('increase', 500, 20))).toBe(600));
  it('500 − 20% = 400', () => expect(valueOf(calculatePercentage('decrease', 500, 20))).toBe(400));
  it('de 80 a 100 = +25%', () => expect(valueOf(calculatePercentage('difference', 80, 100))).toBe(25));
  it('de 100 a 80 = −20%', () => expect(valueOf(calculatePercentage('difference', 100, 80))).toBe(-20));
  it('50 es el 25% de 200', () => expect(valueOf(calculatePercentage('ratio', 50, 200))).toBe(25));

  it('maneja divisiones entre cero', () => {
    expect(calculatePercentage('ratio', 5, 0)).toEqual({ ok: false, error: 'No se puede dividir entre cero' });
    expect(calculatePercentage('difference', 0, 5)).toEqual({ ok: false, error: 'El valor inicial no puede ser 0' });
  });
});
