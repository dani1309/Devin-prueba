import { CURRENCY_CODES, type CurrencyCode } from '../../../config/currencies';
import type { ExchangeRateProvider, ExchangeRates } from './types';

/**
 * Fetches rates from a JSON API. `urlTemplate` must contain `{base}`.
 * Supports the common response shapes `{ rates: {...} }` and `{ conversion_rates: {...} }`.
 */
export class HttpRateProvider implements ExchangeRateProvider {
  readonly name: string;
  readonly isDemo = false;
  private readonly urlTemplate: string;

  constructor(urlTemplate: string) {
    this.urlTemplate = urlTemplate;
    this.name = new URL(urlTemplate.replace('{base}', 'USD')).host;
  }

  async getRates(base: CurrencyCode, signal?: AbortSignal): Promise<ExchangeRates> {
    const response = await fetch(this.urlTemplate.replace('{base}', base), { signal });
    if (!response.ok) throw new Error(`Exchange-rate API responded ${response.status}`);

    const payload: unknown = await response.json();
    const data = (payload ?? {}) as { rates?: Record<string, unknown>; conversion_rates?: Record<string, unknown> };
    const source = data.rates ?? data.conversion_rates ?? {};

    const rates = {} as Record<CurrencyCode, number>;
    for (const code of CURRENCY_CODES) {
      const rate = code === base ? 1 : source[code];
      if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
        throw new Error(`Missing exchange rate for ${code}`);
      }
      rates[code] = rate;
    }

    return { base, rates, updatedAt: new Date(), isDemo: false, source: this.name };
  }
}
