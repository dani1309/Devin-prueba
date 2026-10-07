import { tokenize, type Token } from '../math';
import type { HistoryEntry } from './types';

export interface OperationUsage {
  label: string;
  count: number;
}

export interface HistoryStats {
  total: number;
  last: HistoryEntry | null;
  mostUsedOperation: OperationUsage | null;
  maxResult: number | null;
  minResult: number | null;
}

const OPERATION_LABELS: Record<string, string> = {
  '+': 'Suma',
  '-': 'Resta',
  '*': 'Multiplicación',
  '/': 'División',
  '^': 'Potencia',
  mod: 'Módulo',
  root: 'Raíz n-ésima',
  '%': 'Porcentaje',
  '!': 'Factorial',
  sin: 'Seno',
  cos: 'Coseno',
  tan: 'Tangente',
  asin: 'Arcoseno',
  acos: 'Arcocoseno',
  atan: 'Arcotangente',
  log: 'Logaritmo',
  ln: 'Logaritmo natural',
  sqrt: 'Raíz cuadrada',
  exp: 'Exponencial',
};

const endsOperand = (token: Token | undefined) =>
  token !== undefined &&
  (token.type === 'number' || token.type === 'constant' || token.type === 'rightParen' || token.type === 'postfix');

function operationKeys(expression: string): string[] {
  let tokens: Token[];
  try {
    tokens = tokenize(expression);
  } catch {
    return [];
  }

  return tokens.flatMap((token, index) => {
    if (token.type === 'function') return [token.name];
    if (token.type === 'postfix') return [token.operator];
    if (token.type !== 'operator') return [];
    const isSign = (token.operator === '-' || token.operator === '+') && !endsOperand(tokens[index - 1]);
    return isSign ? [] : [token.operator];
  });
}

export function computeHistoryStats(entries: readonly HistoryEntry[]): HistoryStats {
  if (entries.length === 0) {
    return { total: 0, last: null, mostUsedOperation: null, maxResult: null, minResult: null };
  }

  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const key of operationKeys(entry.expression)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  let mostUsedOperation: OperationUsage | null = null;
  for (const [key, count] of counts) {
    if (!mostUsedOperation || count > mostUsedOperation.count) {
      mostUsedOperation = { label: OPERATION_LABELS[key] ?? key, count };
    }
  }

  const results = entries.map((entry) => entry.result);
  const last = entries.reduce((latest, entry) => (entry.createdAt > latest.createdAt ? entry : latest));

  return {
    total: entries.length,
    last,
    mostUsedOperation,
    maxResult: Math.max(...results),
    minResult: Math.min(...results),
  };
}
