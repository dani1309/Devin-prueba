import type { AngleUnit } from '../math';

export interface HistoryEntry {
  id: string;
  expression: string;
  result: number;
  angleUnit: AngleUnit;
  createdAt: number;
}

export function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.expression === 'string' &&
    typeof entry.result === 'number' &&
    Number.isFinite(entry.result) &&
    (entry.angleUnit === 'deg' || entry.angleUnit === 'rad') &&
    typeof entry.createdAt === 'number'
  );
}

export const isHistoryList = (value: unknown): value is HistoryEntry[] =>
  Array.isArray(value) && value.every(isHistoryEntry);
