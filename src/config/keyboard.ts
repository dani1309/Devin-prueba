import { FUNCTIONS, OPERATORS, POSTFIX } from './symbols';

export type KeyboardAction =
  | { type: 'digit'; digit: string }
  | { type: 'decimal' }
  | { type: 'operator'; operator: string }
  | { type: 'postfix'; symbol: string }
  | { type: 'text'; text: string }
  | { type: 'openParen' }
  | { type: 'closeParen' }
  | { type: 'evaluate' }
  | { type: 'backspace' }
  | { type: 'clear' };

const KEY_MAP: Record<string, KeyboardAction> = {
  '+': { type: 'operator', operator: OPERATORS.add },
  '-': { type: 'operator', operator: OPERATORS.subtract },
  '*': { type: 'operator', operator: OPERATORS.multiply },
  x: { type: 'operator', operator: OPERATORS.multiply },
  '/': { type: 'operator', operator: OPERATORS.divide },
  '^': { type: 'operator', operator: OPERATORS.power },
  '%': { type: 'postfix', symbol: POSTFIX.percent },
  '!': { type: 'postfix', symbol: POSTFIX.factorial },
  '.': { type: 'decimal' },
  ',': { type: 'decimal' },
  '(': { type: 'openParen' },
  ')': { type: 'closeParen' },
  p: { type: 'text', text: 'π' },
  e: { type: 'text', text: 'e' },
  s: { type: 'text', text: FUNCTIONS.sqrt },
  Enter: { type: 'evaluate' },
  '=': { type: 'evaluate' },
  Backspace: { type: 'backspace' },
  Escape: { type: 'clear' },
  Delete: { type: 'clear' },
};

export function keyToAction(key: string): KeyboardAction | null {
  if (/^\d$/.test(key)) return { type: 'digit', digit: key };
  return KEY_MAP[key] ?? null;
}

export const KEYBOARD_SHORTCUTS: ReadonlyArray<readonly [string, string]> = [
  ['0–9', 'Números'],
  ['+ − * /', 'Operadores'],
  ['^', 'Potencia'],
  ['%  !', 'Porcentaje / factorial'],
  ['( )', 'Paréntesis'],
  ['. ,', 'Decimal'],
  ['p  e', 'Constantes π y e'],
  ['s', 'Raíz cuadrada'],
  ['Enter / =', 'Calcular'],
  ['Backspace', 'Borrar un carácter'],
  ['Escape / Supr', 'Limpiar'],
];
