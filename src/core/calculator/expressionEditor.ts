import { formatNumber } from '../math';
import { ATOMIC_CHUNKS, BINARY_OPERATORS, OPERATORS } from '../../config/symbols';

/**
 * Pure helpers that edit the expression string shown on screen.
 * They keep the input well-formed while typing; full validation happens on evaluation.
 */

const TRAILING_NUMBER = /(\d+\.?\d*|\.\d+)$/;
const TRAILING_OPERAND = /(\d+\.?\d*|\.\d+|π|e)$/;

const endsWithAny = (expression: string, candidates: readonly string[]) =>
  candidates.find((candidate) => expression.endsWith(candidate));

export const endsWithOperator = (expression: string) => endsWithAny(expression, BINARY_OPERATORS) !== undefined;

export const endsWithOpenParen = (expression: string) => expression.endsWith('(');

/** True when the expression ends with something that can be followed by an operator. */
export function endsWithOperand(expression: string): boolean {
  if (!expression) return false;
  return /[\d.)!%πe]$/.test(expression);
}

/** True when a `−` at `index` is a sign (start of input, or after an operator or `(`). */
function isUnaryMinusAt(expression: string, index: number): boolean {
  if (expression[index] !== OPERATORS.subtract) return false;
  const before = expression.slice(0, index);
  return before === '' || endsWithOpenParen(before) || endsWithOperator(before);
}

export function appendDigit(expression: string, digit: string): string {
  const current = TRAILING_NUMBER.exec(expression)?.[0];
  if (current === '0') return expression.slice(0, -1) + digit;
  return expression + digit;
}

export function appendDecimal(expression: string): string {
  const current = TRAILING_NUMBER.exec(expression)?.[0];
  if (current?.includes('.')) return expression;
  if (current) return `${expression}.`;
  return `${expression}${endsWithOperand(expression) ? OPERATORS.multiply : ''}0.`;
}

export function appendOperator(expression: string, operator: string): string {
  const isMinus = operator === OPERATORS.subtract;

  if (!expression || endsWithOpenParen(expression)) {
    return isMinus ? expression + operator : expression;
  }

  if (expression.endsWith('.')) {
    return appendOperator(expression.slice(0, -1), operator);
  }

  if (endsWithOperator(expression)) {
    const lastIndex = expression.length - 1;
    if (isUnaryMinusAt(expression, lastIndex)) {
      // e.g. "5×−" + "+" → "5+" : drop the sign and replace the previous operator.
      return isMinus ? expression : appendOperator(expression.slice(0, -1), operator);
    }
    const previous = endsWithAny(expression, BINARY_OPERATORS) ?? '';
    const allowsSign = isMinus && previous !== OPERATORS.add && previous !== OPERATORS.subtract;
    return allowsSign ? expression + operator : expression.slice(0, -previous.length) + operator;
  }

  return expression + operator;
}

export function appendPostfix(expression: string, symbol: string): string {
  return endsWithOperand(expression) ? expression + symbol : expression;
}

/** Appends a function, constant or opening parenthesis, adding an explicit `×` after an operand. */
export function appendText(expression: string, text: string): string {
  const separator = endsWithOperand(expression) ? OPERATORS.multiply : '';
  return expression + separator + text;
}

export const appendOpenParen = (expression: string) => appendText(expression, '(');

export const appendCloseParen = (expression: string) => `${expression})`;

export function backspace(expression: string): string {
  const chunk = endsWithAny(expression, ATOMIC_CHUNKS);
  return expression.slice(0, -(chunk?.length ?? 1));
}

/** Index where the parenthesised group (including any function name) ending at the last `)` starts. */
function findGroupStart(expression: string): number {
  let depth = 0;
  for (let index = expression.length - 1; index >= 0; index -= 1) {
    if (expression[index] === ')') depth += 1;
    if (expression[index] === '(') depth -= 1;
    if (depth === 0) {
      const functionName = /(sin⁻¹|cos⁻¹|tan⁻¹|sin|cos|tan|log|ln|exp|√)$/.exec(expression.slice(0, index));
      return index - (functionName?.[0].length ?? 0);
    }
  }
  return -1;
}

/** Toggles the sign of the last operand: `5` ↔ `(−5`, `3×4` ↔ `3×(−4`. */
export function toggleSign(expression: string): string {
  if (!expression || endsWithOpenParen(expression) || endsWithOperator(expression)) {
    const lastIndex = expression.length - 1;
    if (lastIndex >= 0 && isUnaryMinusAt(expression, lastIndex)) return expression.slice(0, -1);
    return expression + OPERATORS.subtract;
  }

  const operandStart = expression.endsWith(')')
    ? findGroupStart(expression)
    : expression.length - (TRAILING_OPERAND.exec(expression)?.[0].length ?? 0);

  if (operandStart < 0 || operandStart === expression.length) return expression;

  const before = expression.slice(0, operandStart);
  const operand = expression.slice(operandStart);
  const signedPrefix = `(${OPERATORS.subtract}`;

  if (before.endsWith(signedPrefix)) return before.slice(0, -signedPrefix.length) + operand;
  if (before.length > 0 && isUnaryMinusAt(expression, operandStart - 1)) return before.slice(0, -1) + operand;
  return before + signedPrefix + operand;
}

/** Converts a number into expression syntax that the tokenizer reads back exactly. */
export function toExpressionNumber(value: number): string {
  const text = formatNumber(value);
  const [mantissa, exponent] = text.split('e');
  const body = exponent === undefined
    ? mantissa
    : `${mantissa}${OPERATORS.multiply}10${OPERATORS.power}${exponent.replace('+', '').replace('-', OPERATORS.subtract)}`;
  const signed = body.replace(/^-/, OPERATORS.subtract);
  return signed.startsWith(OPERATORS.subtract) || exponent !== undefined ? `(${signed})` : signed;
}

/** Inserts a stored value (history result, memory) at the end of the expression. */
export function insertValue(expression: string, value: number): string {
  return appendText(expression, toExpressionNumber(value));
}

export function countUnclosedParens(expression: string): number {
  let depth = 0;
  for (const char of expression) {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);
  }
  return depth;
}

/** Completes the expression with its missing closing parentheses (used before saving it to history). */
export const closeOpenParens = (expression: string) => expression + ')'.repeat(countUnclosedParens(expression));

/** Adds spacing around binary operators for readability on screen. */
export function prettifyExpression(expression: string): string {
  let output = '';
  let index = 0;
  while (index < expression.length) {
    const rest = expression.slice(index);
    const operator = BINARY_OPERATORS.find((candidate) => rest.startsWith(candidate) && candidate !== OPERATORS.nthRoot);
    if (operator && !(operator === OPERATORS.subtract && isUnaryMinusAt(expression, index)) && operator !== OPERATORS.power) {
      output += ` ${operator} `;
      index += operator.length;
    } else {
      output += expression[index];
      index += 1;
    }
  }
  return output.trim().replace(/\s+/g, ' ');
}
