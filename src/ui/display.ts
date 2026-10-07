import type { CalculatorState } from '../core/calculator';
import { formatExpression } from '../core/format';

type DisplayState = 'editing' | 'result' | 'error';

function sizeFor(text: string): string {
  if (text.length > 22) return 'xs';
  if (text.length > 14) return 'sm';
  return 'md';
}

/** Pantalla de la calculadora: muestra la operación y el resultado. */
export class Display {
  constructor(
    private readonly root: HTMLElement,
    private readonly expressionElement: HTMLElement,
    private readonly resultElement: HTMLElement,
  ) {}

  render(state: CalculatorState): void {
    const displayState: DisplayState =
      state.error !== null ? 'error' : state.result !== null ? 'result' : 'editing';
    const expression = state.expression === '' ? '0' : formatExpression(state.expression);

    let expressionText = expression;
    let resultText = '';
    if (displayState === 'result') {
      expressionText = `${expression} =`;
      resultText = formatExpression(state.result ?? '');
    } else if (displayState === 'error') {
      resultText = state.error ?? '';
    } else if (state.preview !== null) {
      resultText = formatExpression(state.preview);
    }

    this.root.dataset.state = displayState;
    this.expressionElement.textContent = expressionText;
    this.expressionElement.dataset.size = sizeFor(expressionText);
    this.resultElement.textContent = resultText;
    this.resultElement.dataset.size = sizeFor(resultText);
    this.expressionElement.scrollLeft = this.expressionElement.scrollWidth;
  }
}
