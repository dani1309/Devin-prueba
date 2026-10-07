import { CalcError } from '../math';

/** Calculator memory register: `null` means empty. */
export type MemoryValue = number | null;

export type MemoryOperation = 'clear' | 'store' | 'add' | 'subtract';

function ensureFiniteMemory(value: number): number {
  if (!Number.isFinite(value)) throw new CalcError('OVERFLOW');
  return Number(value.toPrecision(15));
}

/** Returns the new memory value; `value` is the number currently on screen (ignored for `clear`). */
export function applyMemoryOperation(memory: MemoryValue, operation: MemoryOperation, value: number): MemoryValue {
  switch (operation) {
    case 'clear':
      return null;
    case 'store':
      return ensureFiniteMemory(value);
    case 'add':
      return ensureFiniteMemory((memory ?? 0) + value);
    case 'subtract':
      return ensureFiniteMemory((memory ?? 0) - value);
  }
}

export const isMemoryValue = (value: unknown): value is MemoryValue =>
  value === null || (typeof value === 'number' && Number.isFinite(value));
