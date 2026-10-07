import { toFriendlyMessage } from './errors';
import { evaluate } from './evaluate';
import { formatNumber } from './format';
import {
  appendDecimal,
  appendDigit,
  appendOperator,
  appendPercent,
  closeParenthesis,
  deleteLast,
  openParenthesis,
  toggleSign,
} from './input';
import type { Operator } from './tokenizer';

export type CalculatorInput =
  | { type: 'digit'; value: string }
  | { type: 'operator'; value: Operator }
  | { type: 'decimal' }
  | { type: 'percent' }
  | { type: 'parenthesis'; value: '(' | ')' }
  | { type: 'toggleSign' }
  | { type: 'backspace' }
  | { type: 'clear' }
  | { type: 'equals' };

export interface CalculatorState {
  /** Expresión interna en ASCII (por ejemplo "2*(3+4)"). */
  expression: string;
  /** Resultado de la última evaluación con "=" (null si no hay). */
  result: string | null;
  /** Mensaje de error de la última evaluación con "=" (null si no hay). */
  error: string | null;
  /** Vista previa del resultado mientras se escribe (null si no aplica). */
  preview: string | null;
}

export type EvaluationListener = (expression: string, result: string) => void;
type StateListener = (state: CalculatorState) => void;

/** Calcula el resultado de una expresión sin lanzar errores. */
export function tryEvaluate(expression: string): string | null {
  try {
    return formatNumber(evaluate(expression));
  } catch {
    return null;
  }
}

export class Calculator {
  private expression = '';
  private result: string | null = null;
  private error: string | null = null;
  private readonly listeners = new Set<StateListener>();

  constructor(private readonly onEvaluate?: EvaluationListener) {}

  getState(): CalculatorState {
    const preview = this.result === null && this.error === null ? this.computePreview() : null;
    return { expression: this.expression, result: this.result, error: this.error, preview };
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  /** Carga una expresión (por ejemplo, desde el historial) para seguir editándola. */
  load(expression: string): void {
    this.expression = expression;
    this.result = null;
    this.error = null;
    this.emit();
  }

  press(input: CalculatorInput): void {
    if (input.type === 'clear') {
      this.load('');
      return;
    }
    if (input.type === 'equals') {
      this.calculate();
      return;
    }

    this.expression = this.applyEdit(this.startingExpression(input), input);
    this.result = null;
    this.error = null;
    this.emit();
  }

  /**
   * Tras un resultado, escribir un número empieza una operación nueva,
   * mientras que un operador continúa a partir del resultado.
   */
  private startingExpression(input: CalculatorInput): string {
    if (this.result === null) return this.expression;
    const startsNew =
      input.type === 'digit' ||
      input.type === 'decimal' ||
      (input.type === 'parenthesis' && input.value === '(');
    return startsNew ? '' : this.result;
  }

  private applyEdit(expression: string, input: CalculatorInput): string {
    switch (input.type) {
      case 'digit':
        return appendDigit(expression, input.value);
      case 'operator':
        return appendOperator(expression, input.value);
      case 'decimal':
        return appendDecimal(expression);
      case 'percent':
        return appendPercent(expression);
      case 'parenthesis':
        return input.value === '(' ? openParenthesis(expression) : closeParenthesis(expression);
      case 'toggleSign':
        return toggleSign(expression);
      case 'backspace':
        return deleteLast(expression);
      default:
        return expression;
    }
  }

  private calculate(): void {
    if (this.expression === '' || this.result !== null) return;
    try {
      const result = formatNumber(evaluate(this.expression));
      this.result = result;
      this.error = null;
      this.onEvaluate?.(this.expression, result);
    } catch (error) {
      this.error = toFriendlyMessage(error);
    }
    this.emit();
  }

  private computePreview(): string | null {
    const preview = tryEvaluate(this.expression);
    return preview !== null && preview !== this.expression ? preview : null;
  }

  private emit(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}
