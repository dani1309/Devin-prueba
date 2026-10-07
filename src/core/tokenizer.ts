import { CalcError } from './errors';

export type Operator = '+' | '-' | '*' | '/';

export type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: Operator }
  | { type: 'percent' }
  | { type: 'lparen' }
  | { type: 'rparen' };

const NUMBER_PATTERN = /^(\d+\.?\d*|\.\d+)/;

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression.charAt(index);

    if (char === ' ') {
      index++;
      continue;
    }

    if (/[\d.]/.test(char)) {
      const match = NUMBER_PATTERN.exec(expression.slice(index));
      if (!match) throw new CalcError('INVALID');
      const raw = match[0];
      index += raw.length;
      if (expression.charAt(index) === '.') throw new CalcError('INVALID');
      tokens.push({ type: 'number', value: Number(raw) });
      continue;
    }

    switch (char) {
      case '+':
      case '-':
      case '*':
      case '/':
        tokens.push({ type: 'operator', value: char });
        break;
      case '%':
        tokens.push({ type: 'percent' });
        break;
      case '(':
        tokens.push({ type: 'lparen' });
        break;
      case ')':
        tokens.push({ type: 'rparen' });
        break;
      default:
        throw new CalcError('INVALID');
    }
    index++;
  }

  return tokens;
}
