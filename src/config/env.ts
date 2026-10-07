/**
 * Optional exchange-rate API. Set `VITE_EXCHANGE_RATE_API_URL` in `.env` (see `.env.example`).
 * The `{base}` placeholder is replaced with the base currency code, e.g.
 * `https://open.er-api.com/v6/latest/{base}`.
 */
export const EXCHANGE_RATE_API_URL: string | undefined = import.meta.env.VITE_EXCHANGE_RATE_API_URL?.trim() || undefined;
