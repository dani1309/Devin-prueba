import type { CalculatorInput } from '../core/calculator';

/** Traduce una tecla física a una entrada de la calculadora. */
export function keyToInput(key: string): CalculatorInput | null {
  if (/^[0-9]$/.test(key)) return { type: 'digit', value: key };

  switch (key) {
    case '+':
    case '-':
    case '*':
    case '/':
      return { type: 'operator', value: key };
    case 'x':
    case 'X':
      return { type: 'operator', value: '*' };
    case '.':
    case ',':
      return { type: 'decimal' };
    case '%':
      return { type: 'percent' };
    case '(':
    case ')':
      return { type: 'parenthesis', value: key };
    case 'Enter':
    case '=':
      return { type: 'equals' };
    case 'Backspace':
      return { type: 'backspace' };
    case 'Escape':
    case 'Delete':
      return { type: 'clear' };
    default:
      return null;
  }
}

export function attachKeyboard(onInput: (input: CalculatorInput) => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const input = keyToInput(event.key);
    if (!input) return;
    // Evita que Enter "pulse" el botón enfocado o que "/" abra la búsqueda del navegador.
    event.preventDefault();
    onInput(input);
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}
