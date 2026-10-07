import type { CalculatorInput } from '../core/calculator';
import { ICONS } from './dom';

type KeyVariant = 'digit' | 'function' | 'operator' | 'equals';

interface KeyConfig {
  label: string;
  ariaLabel: string;
  input: CalculatorInput;
  variant: KeyVariant;
  className?: string;
}

const digit = (value: string): KeyConfig => ({
  label: value,
  ariaLabel: value,
  input: { type: 'digit', value },
  variant: 'digit',
});

/** Distribución de botones, fila por fila (4 columnas). */
export const KEYPAD_LAYOUT: readonly KeyConfig[] = [
  { label: 'C', ariaLabel: 'Limpiar todo', input: { type: 'clear' }, variant: 'function' },
  { label: ICONS.backspace, ariaLabel: 'Borrar', input: { type: 'backspace' }, variant: 'function' },
  { label: '%', ariaLabel: 'Porcentaje', input: { type: 'percent' }, variant: 'function' },
  { label: '÷', ariaLabel: 'Dividir', input: { type: 'operator', value: '/' }, variant: 'operator' },

  { label: '(', ariaLabel: 'Abrir paréntesis', input: { type: 'parenthesis', value: '(' }, variant: 'function' },
  { label: ')', ariaLabel: 'Cerrar paréntesis', input: { type: 'parenthesis', value: ')' }, variant: 'function' },
  { label: '+/−', ariaLabel: 'Cambiar signo', input: { type: 'toggleSign' }, variant: 'function' },
  { label: '×', ariaLabel: 'Multiplicar', input: { type: 'operator', value: '*' }, variant: 'operator' },

  digit('7'),
  digit('8'),
  digit('9'),
  { label: '−', ariaLabel: 'Restar', input: { type: 'operator', value: '-' }, variant: 'operator' },

  digit('4'),
  digit('5'),
  digit('6'),
  { label: '+', ariaLabel: 'Sumar', input: { type: 'operator', value: '+' }, variant: 'operator' },

  digit('1'),
  digit('2'),
  digit('3'),
  { label: '=', ariaLabel: 'Igual', input: { type: 'equals' }, variant: 'equals', className: 'key--tall' },

  { ...digit('0'), className: 'key--wide' },
  { label: '.', ariaLabel: 'Punto decimal', input: { type: 'decimal' }, variant: 'digit' },
];

/** Identificador estable de una entrada, usado para resaltar el botón al usar el teclado. */
export function inputKey(input: CalculatorInput): string {
  return 'value' in input ? `${input.type}:${input.value}` : input.type;
}

export class Keypad {
  private readonly buttons = new Map<string, HTMLButtonElement>();

  constructor(container: HTMLElement, onInput: (input: CalculatorInput) => void) {
    for (const key of KEYPAD_LAYOUT) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = ['key', `key--${key.variant}`, key.className].filter(Boolean).join(' ');
      button.innerHTML = key.label;
      button.setAttribute('aria-label', key.ariaLabel);
      button.addEventListener('click', () => onInput(key.input));
      container.append(button);
      this.buttons.set(inputKey(key.input), button);
    }
  }

  /** Resalta brevemente el botón correspondiente a una entrada del teclado físico. */
  flash(input: CalculatorInput): void {
    const button = this.buttons.get(inputKey(input));
    if (!button) return;
    button.classList.remove('is-pressed');
    void button.offsetWidth;
    button.classList.add('is-pressed');
    window.setTimeout(() => button.classList.remove('is-pressed'), 150);
  }
}
