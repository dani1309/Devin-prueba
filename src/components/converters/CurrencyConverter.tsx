import { useState } from 'react';
import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from '../../config/currencies';
import { convertCurrency } from '../../core/converters/currency';
import { formatNumber } from '../../core/math';
import { parseNumberInput } from '../../core/validation/numberInput';
import { useExchangeRates } from '../../hooks/useExchangeRates';
import { formatDateTime } from '../../utils/date';
import { NumberField } from '../common/NumberField';
import { SelectField } from '../common/SelectField';
import { SwapIcon } from '../common/Icons';
import { ConverterLayout } from './ConverterLayout';

const CURRENCY_OPTIONS = CURRENCY_CODES.map((code) => ({ value: code, label: `${code} — ${CURRENCIES[code].name}` }));

function formatMoney(amount: number, code: CurrencyCode): string {
  return new Intl.NumberFormat(CURRENCIES[code].locale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: Math.abs(amount) < 1 ? 6 : 2,
  }).format(amount);
}

export function CurrencyConverter() {
  const [from, setFrom] = useState<CurrencyCode>('USD');
  const [to, setTo] = useState<CurrencyCode>('COP');
  const [input, setInput] = useState('100');
  const { rates, loading, warning, providerName } = useExchangeRates(from);

  const parsed = parseNumberInput(input);
  const error = !parsed.ok && input.trim() ? parsed.error : parsed.ok && parsed.value < 0 ? 'Introduce una cantidad positiva' : null;
  const amount = parsed.ok && parsed.value >= 0 ? parsed.value : null;
  const converted = rates && amount !== null ? convertCurrency(amount, from, to, rates) : null;

  return (
    <ConverterLayout title="Conversor de monedas" description="COP, USD, EUR y GBP. Preparado para conectarse a una API de tasas de cambio.">
      {rates?.isDemo && (
        <div className="notice notice--warning" role="note">
          <strong>Tasas de demostración.</strong> Son valores ilustrativos, no tasas reales ni en tiempo real.
          {warning ? ` ${warning}` : ' Configura VITE_EXCHANGE_RATE_API_URL para usar datos reales (ver README).'}
        </div>
      )}

      <div className="converter__grid">
        <NumberField label="Cantidad" value={input} onChange={setInput} error={error} suffix={from} />
        <div className="converter__pair">
          <SelectField label="De" value={from} options={CURRENCY_OPTIONS} onChange={(value) => setFrom(value as CurrencyCode)} />
          <button
            type="button"
            className="icon-button converter__swap"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            aria-label="Intercambiar monedas"
            title="Intercambiar monedas"
          >
            <SwapIcon />
          </button>
          <SelectField label="A" value={to} options={CURRENCY_OPTIONS} onChange={(value) => setTo(value as CurrencyCode)} />
        </div>
      </div>

      <div className="converter__result" aria-live="polite" aria-busy={loading}>
        {loading && !rates ? (
          <span className="converter__result-label">Cargando tasas…</span>
        ) : converted !== null && amount !== null ? (
          <>
            <span className="converter__result-label">{formatMoney(amount, from)} =</span>
            <span className="converter__result-value">{formatMoney(converted, to)}</span>
            {rates && (
              <span className="converter__result-meta">
                1 {from} = {formatNumber(rates.rates[to], { grouping: true })} {to}
                {rates.isDemo ? ' · demostración' : ` · ${providerName}`}
                {rates.updatedAt && ` · ${formatDateTime(rates.updatedAt)}`}
              </span>
            )}
          </>
        ) : (
          <span className="converter__result-label">Introduce una cantidad para convertir</span>
        )}
      </div>

      {rates && amount !== null && (
        <div className="equivalences">
          <h3 className="equivalences__title">Equivalencias de {formatMoney(amount, from)}</h3>
          <ul className="equivalences__list">
            {CURRENCY_CODES.filter((code) => code !== from).map((code) => (
              <li key={code} className="equivalences__item">
                <span>{CURRENCIES[code].name}</span>
                <strong>{formatMoney(convertCurrency(amount, from, code, rates), code)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ConverterLayout>
  );
}
