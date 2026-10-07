import { useEffect, useMemo, useState } from 'react';
import type { CurrencyCode } from '../config/currencies';
import { DemoRateProvider, createExchangeRateProvider, type ExchangeRates } from '../core/converters/currency';

interface ExchangeRatesState {
  rates: ExchangeRates | null;
  /** Set when the configured API failed and demo rates are shown instead. */
  warning: string | null;
}

const API_FAILURE_WARNING = 'No se pudo conectar con la API de tasas de cambio. Se muestran tasas de demostración.';

export function useExchangeRates(base: CurrencyCode) {
  const provider = useMemo(() => createExchangeRateProvider(), []);
  const [state, setState] = useState<ExchangeRatesState>({ rates: null, warning: null });

  useEffect(() => {
    const controller = new AbortController();

    provider
      .getRates(base, controller.signal)
      .then((rates) => setState({ rates, warning: null }))
      .catch(async () => {
        if (controller.signal.aborted) return;
        const rates = await new DemoRateProvider().getRates(base);
        setState({ rates, warning: API_FAILURE_WARNING });
      });

    return () => controller.abort();
  }, [base, provider]);

  const isCurrent = state.rates?.base === base;
  return {
    rates: isCurrent ? state.rates : null,
    warning: state.warning,
    loading: !isCurrent,
    providerName: provider.name,
  };
}
