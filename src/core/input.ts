import type { Operator } from './tokenizer';

/**
 * Funciones puras para editar la expresión que escribe el usuario.
 * Evitan secuencias imposibles (como "5+*3" o "1.2.3") mientras se escribe.
 */

export const MAX_EXPRESSION_LENGTH = 100;

const OPERATORS: readonly string[] = ['+', '-', '*', '/'];

export function isOperator(char: string): boolean {
  return OPERATORS.includes(char);
}

function isDigit(char: string): boolean {
  return char >= '0' && char <= '9';
}

function lastChar(expression: string): string {
  return expression.charAt(expression.length - 1);
}

/** Carácter tras el cual puede venir un operador (fin de un operando). */
function endsOperand(char: string): boolean {
  return isDigit(char) || char === ')' || char === '%' || char === '.';
}

function currentNumber(expression: string): string {
  return /[\d.]*$/.exec(expression)?.[0] ?? '';
}

function withLimit(previous: string, next: string): string {
  return next.length > MAX_EXPRESSION_LENGTH ? previous : next;
}

function stripTrailingDot(expression: string): string {
  return lastChar(expression) === '.' ? expression.slice(0, -1) : expression;
}

function openParenthesesCount(expression: string): number {
  let count = 0;
  for (const char of expression) {
    if (char === '(') count++;
    else if (char === ')') count--;
  }
  return count;
}

/** Un "-" es unario cuando está al inicio o tras un operador o "(". */
function isUnaryMinusAt(expression: string, index: number): boolean {
  if (expression.charAt(index) !== '-') return false;
  const previous = expression.charAt(index - 1);
  return index === 0 || isOperator(previous) || previous === '(';
}

/** Índice donde empieza el último operando (número o grupo entre paréntesis). */
function lastOperandStart(expression: string): number {
  let index = expression.length;
  while (expression.charAt(index - 1) === '%') index--;

  if (expression.charAt(index - 1) === ')') {
    let depth = 0;
    for (let i = index - 1; i >= 0; i--) {
      const char = expression.charAt(i);
      if (char === ')') depth++;
      else if (char === '(') depth--;
      if (depth === 0) return i;
    }
    return 0;
  }

  while (index > 0 && /[\d.]/.test(expression.charAt(index - 1))) index--;
  return index;
}

export function appendDigit(expression: string, digit: string): string {
  const last = lastChar(expression);
  if (last === ')' || last === '%') {
    return withLimit(expression, `${expression}*${digit}`);
  }
  if (currentNumber(expression) === '0') {
    return digit === '0' ? expression : withLimit(expression, expression.slice(0, -1) + digit);
  }
  return withLimit(expression, expression + digit);
}

export function appendDecimal(expression: string): string {
  const number = currentNumber(expression);
  if (number.includes('.')) return expression;
  const last = lastChar(expression);
  if (last === ')' || last === '%') return withLimit(expression, `${expression}*0.`);
  if (number === '') return withLimit(expression, `${expression}0.`);
  return withLimit(expression, `${expression}.`);
}

export function appendOperator(expression: string, operator: Operator): string {
  const base = stripTrailingDot(expression);
  const last = lastChar(base);

  if (base === '' || last === '(') {
    return operator === '-' ? withLimit(expression, `${base}-`) : base;
  }

  if (isOperator(last)) {
    if (operator === '-' && (last === '*' || last === '/')) {
      return withLimit(expression, `${base}-`);
    }
    const withoutOperators = base.replace(/[+\-*/]+$/, '');
    const previous = lastChar(withoutOperators);
    if (withoutOperators === '' || previous === '(') {
      return operator === '-' ? `${withoutOperators}-` : withoutOperators;
    }
    return withoutOperators + operator;
  }

  return withLimit(expression, base + operator);
}

export function appendPercent(expression: string): string {
  return endsOperand(lastChar(expression)) && lastChar(expression) !== '%'
    ? withLimit(expression, stripTrailingDot(expression) + '%')
    : expression;
}

export function openParenthesis(expression: string): string {
  const base = stripTrailingDot(expression);
  return endsOperand(lastChar(base))
    ? withLimit(expression, `${base}*(`)
    : withLimit(expression, `${base}(`);
}

export function closeParenthesis(expression: string): string {
  if (openParenthesesCount(expression) <= 0 || !endsOperand(lastChar(expression))) {
    return expression;
  }
  return withLimit(expression, `${stripTrailingDot(expression)})`);
}

export function deleteLast(expression: string): string {
  return expression.slice(0, -1);
}

/** Cambia el signo del último número o grupo entre paréntesis. */
export function toggleSign(expression: string): string {
  if (expression === '') return '-';
  const last = lastChar(expression);

  if (isOperator(last) || last === '(') {
    if (last === '-') {
      return isUnaryMinusAt(expression, expression.length - 1)
        ? expression.slice(0, -1)
        : `${expression.slice(0, -1)}+`;
    }
    if (last === '+') return `${expression.slice(0, -1)}-`;
    return withLimit(expression, `${expression}-`);
  }

  const start = lastOperandStart(expression);
  const signIndex = start - 1;
  const sign = expression.charAt(signIndex);
  const before = expression.slice(0, Math.max(signIndex, 0));
  const operand = expression.slice(start);

  if (sign === '-') {
    return isUnaryMinusAt(expression, signIndex) ? before + operand : `${before}+${operand}`;
  }
  if (sign === '+') return `${before}-${operand}`;
  return withLimit(expression, `${expression.slice(0, start)}-${operand}`);
}
