import { CURRENCY_CODES, DEMO_RATES_PER_USD, type CurrencyCode } from '../../../config/currencies';
import type { ExchangeRateProvider, ExchangeRates } from './types';

export function rebaseRates(ratesPerUsd: Record<CurrencyCode, number>, base: CurrencyCode): Record<CurrencyCode, number> {
  const baseRate = ratesPerUsd[base];
  return Object.fromEntries(CURRENCY_CODES.map((code) => [code, ratesPerUsd[code] / baseRate])) as Record<
    CurrencyCode,
    number
  >;
}

export class DemoRateProvider implements ExchangeRateProvider {
  readonly name = 'Tasas de demostración';
  readonly isDemo = true;

  async getRates(base: CurrencyCode): Promise<ExchangeRates> {
    return {
      base,
      rates: rebaseRates(DEMO_RATES_PER_USD, base),
      updatedAt: null,
      isDemo: true,
      source: this.name,
    };
  }
}
