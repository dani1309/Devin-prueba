import { CalcError } from './errors';

export type BinaryOperator = '+' | '-' | '*' | '/' | '^' | 'mod' | 'root';
export type PostfixOperator = '%' | '!';
export type FunctionName = 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan' | 'log' | 'ln' | 'sqrt' | 'exp';
export type ConstantName = 'pi' | 'e';

export type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; operator: BinaryOperator }
  | { type: 'postfix'; operator: PostfixOperator }
  | { type: 'function'; name: FunctionName }
  | { type: 'constant'; name: ConstantName }
  | { type: 'leftParen' }
  | { type: 'rightParen' };

const operator = (value: BinaryOperator): Token => ({ type: 'operator', operator: value });
const postfix = (value: PostfixOperator): Token => ({ type: 'postfix', operator: value });
const fn = (name: FunctionName): Token => ({ type: 'function', name });
const constant = (name: ConstantName): Token => ({ type: 'constant', name });

/** Every textual symbol accepted in an expression (display symbols and keyboard/ASCII aliases). */
const SYMBOL_TABLE: ReadonlyArray<readonly [string, Token]> = (
  [
    ['sin⁻¹', fn('asin')],
    ['cos⁻¹', fn('acos')],
    ['tan⁻¹', fn('atan')],
    ['asin', fn('asin')],
    ['acos', fn('acos')],
    ['atan', fn('atan')],
    ['sin', fn('sin')],
    ['cos', fn('cos')],
    ['tan', fn('tan')],
    ['log', fn('log')],
    ['ln', fn('ln')],
    ['exp', fn('exp')],
    ['sqrt', fn('sqrt')],
    ['√', fn('sqrt')],
    ['ⁿ√', operator('root')],
    ['mod', operator('mod')],
    ['pi', constant('pi')],
    ['π', constant('pi')],
    ['e', constant('e')],
    ['+', operator('+')],
    ['-', operator('-')],
    ['−', operator('-')],
    ['–', operator('-')],
    ['*', operator('*')],
    ['×', operator('*')],
    ['·', operator('*')],
    ['/', operator('/')],
    ['÷', operator('/')],
    ['^', operator('^')],
    ['%', postfix('%')],
    ['!', postfix('!')],
    ['(', { type: 'leftParen' }],
    [')', { type: 'rightParen' }],
  ] as const
)
  .slice()
  .sort((a, b) => b[0].length - a[0].length);

const NUMBER_PATTERN = /^(\d+\.?\d*|\.\d+)/;

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    const rest = expression.slice(index);
    const numberMatch = NUMBER_PATTERN.exec(rest);
    if (numberMatch) {
      tokens.push({ type: 'number', value: Number(numberMatch[0]) });
      index += numberMatch[0].length;
      continue;
    }

    const symbol = SYMBOL_TABLE.find(([text]) => rest.startsWith(text));
    if (!symbol) {
      throw new CalcError('INVALID');
    }
    tokens.push(symbol[1]);
    index += symbol[0].length;
  }

  return tokens;
}
