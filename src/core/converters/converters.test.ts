import { describe, expect, it } from 'vitest';
import { convertUnit } from './unitConverter';
import { DemoRateProvider, convertCurrency, createExchangeRateProvider } from './currency';

const value = (result: ReturnType<typeof convertUnit>) => (result.ok ? result.value : NaN);

describe('convertUnit', () => {
  it.each([
    ['length', 1, 'km', 'm', 1000],
    ['length', 1, 'mi', 'km', 1.609344],
    ['length', 12, 'in', 'ft', 1],
    ['length', 250, 'cm', 'mm', 2500],
    ['weight', 1, 'kg', 'lb', 2.20462262185],
    ['weight', 16, 'oz', 'lb', 1],
    ['weight', 1500, 'g', 'kg', 1.5],
    ['temperature', 100, 'c', 'f', 212],
    ['temperature', 32, 'f', 'c', 0],
    ['temperature', 0, 'k', 'c', -273.15],
    ['area', 1, 'km2', 'm2', 1e6],
    ['area', 1, 'acre', 'ft2', 43560],
    ['volume', 1, 'm3', 'l', 1000],
    ['volume', 1, 'gal', 'ml', 3785.411784],
    ['speed', 36, 'kmh', 'ms', 10],
    ['speed', 60, 'mph', 'kmh', 96.56064],
  ])('%s: %s %s → %s = %s', (category, input, from, to, expected) => {
    expect(value(convertUnit(category, input, from, to))).toBeCloseTo(expected, 6);
  });

  it('rechaza temperaturas por debajo del cero absoluto', () => {
    expect(convertUnit('temperature', -300, 'c', 'k')).toEqual({
      ok: false,
      error: 'La temperatura no puede ser inferior al cero absoluto',
    });
  });
});

describe('conversión de monedas', () => {
  it('usa el proveedor de demostración si no hay API configurada', async () => {
    const provider = createExchangeRateProvider(undefined);
    expect(provider.isDemo).toBe(true);
    const rates = await provider.getRates('USD');
    expect(rates.isDemo).toBe(true);
    expect(convertCurrency(10, 'USD', 'COP', rates)).toBe(40000);
  });

  it('convierte entre cualquier par independientemente de la base', async () => {
    const rates = await new DemoRateProvider().getRates('EUR');
    expect(convertCurrency(4000, 'COP', 'USD', rates)).toBeCloseTo(1, 10);
    expect(convertCurrency(1, 'EUR', 'EUR', rates)).toBe(1);
  });
});
