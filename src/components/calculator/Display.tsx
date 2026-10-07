import { useEffect, useRef } from 'react';
import { countUnclosedParens, prettifyExpression } from '../../core/calculator/expressionEditor';
import { formatNumber, type AngleUnit } from '../../core/math';
import type { MemoryValue } from '../../core/memory/memoryOperations';
import { CopyIcon } from '../common/Icons';

interface DisplayProps {
  expression: string;
  result: number | null;
  preview: number | null;
  error: string | null;
  justEvaluated: boolean;
  memory: MemoryValue;
  angleUnit: AngleUnit;
  showAngleUnit: boolean;
  onCopy: (text: string) => void;
}

export function Display({ expression, result, preview, error, justEvaluated, memory, angleUnit, showAngleUnit, onCopy }: DisplayProps) {
  const expressionRef = useRef<HTMLDivElement>(null);
  const missingParens = countUnclosedParens(expression);
  const shownValue = justEvaluated ? result : preview;
  const shownText = shownValue === null ? '' : formatNumber(shownValue, { grouping: true });

  useEffect(() => {
    const element = expressionRef.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, [expression]);

  const resultSize = shownText.length > 16 ? 'is-small' : shownText.length > 11 ? 'is-medium' : '';

  return (
    <section className="display" aria-label="Pantalla de la calculadora">
      <div className="display__status">
        <div className="display__badges">
          {memory !== null && (
            <span className="badge badge--memory" title={`Memoria: ${formatNumber(memory)}`}>
              M <span className="badge__value">{formatNumber(memory, { grouping: true })}</span>
            </span>
          )}
          {showAngleUnit && <span className="badge">{angleUnit === 'deg' ? 'DEG' : 'RAD'}</span>}
        </div>
        {shownValue !== null && (
          <button
            type="button"
            className="icon-button icon-button--small"
            onClick={() => onCopy(formatNumber(shownValue))}
            aria-label="Copiar resultado"
            title="Copiar resultado"
          >
            <CopyIcon />
          </button>
        )}
      </div>

      <div ref={expressionRef} className="display__expression" aria-label="Operación">
        {expression ? prettifyExpression(expression) : <span className="display__placeholder">0</span>}
        {missingParens > 0 && <span className="display__ghost" aria-hidden="true">{')'.repeat(missingParens)}</span>}
      </div>

      <div className="display__result-row" aria-live="polite" aria-atomic="true">
        {error ? (
          <p className="display__error" role="alert">
            {error}
          </p>
        ) : (
          <output
            className={`display__result ${justEvaluated ? 'is-final' : 'is-preview'} ${resultSize}`}
            aria-label={justEvaluated ? 'Resultado' : 'Resultado previo'}
          >
            {shownText && (
              <>
                <span className="display__equals" aria-hidden="true">
                  =
                </span>
                {shownText}
              </>
            )}
          </output>
        )}
      </div>
    </section>
  );
}
