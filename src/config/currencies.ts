export const CURRENCY_CODES = ['COP', 'USD', 'EUR', 'GBP'] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export interface CurrencyDefinition {
  code: CurrencyCode;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDefinition> = {
  COP: { code: 'COP', name: 'Peso colombiano', locale: 'es-CO' },
  USD: { code: 'USD', name: 'Dólar estadounidense', locale: 'es-CO' },
  EUR: { code: 'EUR', name: 'Euro', locale: 'es-CO' },
  GBP: { code: 'GBP', name: 'Libra esterlina', locale: 'es-CO' },
};

/**
 * Illustrative rates (units per 1 USD) used only when no exchange-rate API is configured.
 * They are NOT real-time values and are labelled as demo data in the UI.
 */
export const DEMO_RATES_PER_USD: Record<CurrencyCode, number> = {
  USD: 1,
  COP: 4000,
  EUR: 0.9,
  GBP: 0.8,
};
