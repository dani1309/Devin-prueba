/** Symbols written into the expression shown on screen. The math tokenizer understands all of them. */
export const OPERATORS = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  mod: 'mod',
  nthRoot: 'ⁿ√',
} as const;

export type OperatorSymbol = (typeof OPERATORS)[keyof typeof OPERATORS];

export const BINARY_OPERATORS: readonly string[] = Object.values(OPERATORS);

export const POSTFIX = { percent: '%', factorial: '!' } as const;
export type PostfixSymbol = (typeof POSTFIX)[keyof typeof POSTFIX];

export const CONSTANTS = { pi: 'π', e: 'e' } as const;

/** Function prefixes inserted with their opening parenthesis. */
export const FUNCTIONS = {
  sin: 'sin(',
  cos: 'cos(',
  tan: 'tan(',
  asin: 'sin⁻¹(',
  acos: 'cos⁻¹(',
  atan: 'tan⁻¹(',
  log: 'log(',
  ln: 'ln(',
  sqrt: '√(',
  exp: 'exp(',
} as const;

export type FunctionSymbol = (typeof FUNCTIONS)[keyof typeof FUNCTIONS];

/** Multi-character chunks removed as a unit by backspace, longest first. */
export const ATOMIC_CHUNKS: readonly string[] = [...Object.values(FUNCTIONS), OPERATORS.mod, OPERATORS.nthRoot].sort(
  (a, b) => b.length - a.length,
);
