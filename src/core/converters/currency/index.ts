import { EXCHANGE_RATE_API_URL } from '../../../config/env';
import type { CurrencyCode } from '../../../config/currencies';
import { DemoRateProvider } from './demoRateProvider';
import { HttpRateProvider } from './httpRateProvider';
import type { ExchangeRateProvider, ExchangeRates } from './types';

export type { ExchangeRateProvider, ExchangeRates } from './types';
export { DemoRateProvider } from './demoRateProvider';

export function createExchangeRateProvider(apiUrl = EXCHANGE_RATE_API_URL): ExchangeRateProvider {
  return apiUrl ? new HttpRateProvider(apiUrl) : new DemoRateProvider();
}

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode, rates: ExchangeRates): number {
  const amountInBase = amount / rates.rates[from];
  return amountInBase * rates.rates[to];
}
