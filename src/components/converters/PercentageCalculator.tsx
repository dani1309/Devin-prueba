import { useState } from 'react';
import { PERCENTAGE_MODES, calculatePercentage, type PercentageMode } from '../../core/percentage/percentageCalculator';
import { parseNumberInput } from '../../core/validation/numberInput';
import { NumberField } from '../common/NumberField';
import { ConverterLayout } from './ConverterLayout';

const EXAMPLES: Record<PercentageMode, [string, string]> = {
  percentOf: ['20', '500'],
  increase: ['500', '20'],
  decrease: ['500', '20'],
  difference: ['80', '100'],
  ratio: ['50', '200'],
};

export function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>('percentOf');
  const [[first, second], setValues] = useState(EXAMPLES.percentOf);

  const config = PERCENTAGE_MODES.find((item) => item.id === mode) ?? PERCENTAGE_MODES[0];
  const firstParsed = parseNumberInput(first);
  const secondParsed = parseNumberInput(second);
  const result = firstParsed.ok && secondParsed.ok ? calculatePercentage(mode, firstParsed.value, secondParsed.value) : null;

  const fieldError = (raw: string, parsed: ReturnType<typeof parseNumberInput>) => (!parsed.ok && raw.trim() ? parsed.error : null);

  return (
    <ConverterLayout title="Calculadora de porcentajes" description="Calcula porcentajes, aumentos, descuentos y variaciones.">
      <div className="mode-cards" role="radiogroup" aria-label="Tipo de cálculo">
        {PERCENTAGE_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === mode}
            className={`mode-card${item.id === mode ? ' is-active' : ''}`}
            onClick={() => {
              setMode(item.id);
              setValues(EXAMPLES[item.id]);
            }}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="converter__grid converter__grid--two">
        <NumberField
          label={config.firstLabel}
          value={first}
          onChange={(value) => setValues([value, second])}
          error={fieldError(first, firstParsed)}
        />
        <NumberField
          label={config.secondLabel}
          value={second}
          onChange={(value) => setValues([first, value])}
          error={fieldError(second, secondParsed)}
        />
      </div>

      <div className="converter__result" aria-live="polite">
        {result?.ok ? (
          <>
            <span className="converter__result-label">Resultado</span>
            <span className="converter__result-value">{result.formatted}</span>
            <span className="converter__result-meta">{result.explanation}</span>
          </>
        ) : (
          <span className={`converter__result-label${result && !result.ok ? ' is-error' : ''}`}>
            {result && !result.ok ? result.error : 'Introduce ambos valores'}
          </span>
        )}
      </div>
    </ConverterLayout>
  );
}
