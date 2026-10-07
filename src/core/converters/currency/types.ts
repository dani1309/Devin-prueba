import type { CurrencyCode } from '../../../config/currencies';

export interface ExchangeRates {
  base: CurrencyCode;
  /** Units of each currency per 1 unit of `base`. */
  rates: Record<CurrencyCode, number>;
  updatedAt: Date | null;
  isDemo: boolean;
  source: string;
}

/** Contract every exchange-rate source must follow; swap implementations without touching the UI. */
export interface ExchangeRateProvider {
  readonly name: string;
  readonly isDemo: boolean;
  getRates(base: CurrencyCode, signal?: AbortSignal): Promise<ExchangeRates>;
}
