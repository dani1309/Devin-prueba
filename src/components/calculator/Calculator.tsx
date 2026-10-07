import { useCallback } from 'react';
import type { KeyboardAction } from '../../config/keyboard';
import type { AngleUnit } from '../../core/math';
import type { MemoryOperation, MemoryValue } from '../../core/memory/memoryOperations';
import type { CalculatorController } from '../../hooks/useCalculator';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import type { MemoryOutcome } from '../../hooks/useMemory';
import type { CalculatorMode } from '../../hooks/usePreferences';
import type { Notify } from '../../hooks/useToast';
import { formatNumber } from '../../core/math';
import { SegmentedControl } from '../common/SegmentedControl';
import { BasicKeypad } from './BasicKeypad';
import { Display } from './Display';
import { KeyboardHelp } from './KeyboardHelp';
import { MemoryBar } from './MemoryBar';
import { ScientificKeypad } from './ScientificKeypad';
import './calculator.css';

const MODE_OPTIONS = [
  { value: 'basic', label: 'Básica' },
  { value: 'scientific', label: 'Científica' },
] as const;

const MEMORY_MESSAGES: Record<Exclude<MemoryOperation, 'clear'>, string> = {
  store: 'Guardado en memoria',
  add: 'Sumado a memoria',
  subtract: 'Restado de memoria',
};

interface CalculatorProps {
  calculator: CalculatorController;
  mode: CalculatorMode;
  angleUnit: AngleUnit;
  memory: MemoryValue;
  keyboardEnabled: boolean;
  onModeChange: (mode: CalculatorMode) => void;
  onAngleUnitChange: (unit: AngleUnit) => void;
  onMemoryOperation: (operation: MemoryOperation, value: number) => MemoryOutcome;
  notify: Notify;
}

export function Calculator({
  calculator,
  mode,
  angleUnit,
  memory,
  keyboardEnabled,
  onModeChange,
  onAngleUnitChange,
  onMemoryOperation,
  notify,
}: CalculatorProps) {
  const handleKeyboard = useCallback(
    (action: KeyboardAction) => {
      switch (action.type) {
        case 'digit':
          return calculator.inputDigit(action.digit);
        case 'decimal':
          return calculator.inputDecimal();
        case 'operator':
          return calculator.inputOperator(action.operator);
        case 'postfix':
          return calculator.inputPostfix(action.symbol);
        case 'text':
          return calculator.inputText(action.text);
        case 'openParen':
          return calculator.openParen();
        case 'closeParen':
          return calculator.closeParen();
        case 'evaluate':
          return calculator.evaluate();
        case 'backspace':
          return calculator.backspace();
        case 'clear':
          return calculator.clear();
      }
    },
    [calculator],
  );

  useKeyboardShortcuts(handleKeyboard, keyboardEnabled);

  const handleMemory = (operation: MemoryOperation) => {
    if (operation === 'clear') {
      onMemoryOperation('clear', 0);
      notify('Memoria borrada');
      return;
    }
    if (calculator.currentValue === null) {
      notify('No hay un número válido en pantalla', 'error');
      return;
    }
    const outcome = onMemoryOperation(operation, calculator.currentValue);
    if (outcome.ok) {
      notify(`${MEMORY_MESSAGES[operation]}: ${formatNumber(outcome.memory ?? 0)}`);
    } else {
      notify(outcome.error, 'error');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => notify('Resultado copiado'))
      .catch(() => notify('No se pudo copiar', 'error'));
  };

  return (
    <section className={`calculator card calculator--${mode}`} aria-label="Calculadora">
      <div className="calculator__toolbar">
        <SegmentedControl label="Modo de la calculadora" options={MODE_OPTIONS} value={mode} onChange={onModeChange} />
      </div>

      <Display
        expression={calculator.expression}
        result={calculator.result}
        preview={calculator.preview}
        error={calculator.error}
        justEvaluated={calculator.justEvaluated}
        memory={memory}
        angleUnit={angleUnit}
        showAngleUnit={mode === 'scientific'}
        onCopy={handleCopy}
      />

      <MemoryBar memory={memory} onOperation={handleMemory} onRecall={() => memory !== null && calculator.insertValue(memory)} />

      <div className="calculator__keys" data-keypad>
        {mode === 'scientific' && (
          <ScientificKeypad calculator={calculator} angleUnit={angleUnit} onAngleUnitChange={onAngleUnitChange} />
        )}
        <BasicKeypad calculator={calculator} />
      </div>

      <KeyboardHelp />
    </section>
  );
}
