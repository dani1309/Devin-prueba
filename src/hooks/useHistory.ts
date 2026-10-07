import { useCallback } from 'react';
import { HISTORY_LIMIT, STORAGE_KEYS } from '../config/storage';
import { isHistoryList, type HistoryEntry } from '../core/history/types';
import type { AngleUnit } from '../core/math';
import { createId } from '../utils/id';
import { usePersistentState } from './usePersistentState';

export function useHistory() {
  const [entries, setEntries] = usePersistentState<HistoryEntry[]>(STORAGE_KEYS.history, [], isHistoryList);

  const addEntry = useCallback(
    (expression: string, result: number, angleUnit: AngleUnit) => {
      const entry: HistoryEntry = { id: createId(), expression, result, angleUnit, createdAt: Date.now() };
      setEntries((current) => [entry, ...current].slice(0, HISTORY_LIMIT));
    },
    [setEntries],
  );

  const removeEntry = useCallback(
    (id: string) => setEntries((current) => current.filter((entry) => entry.id !== id)),
    [setEntries],
  );

  const clearHistory = useCallback(() => setEntries([]), [setEntries]);

  return { entries, addEntry, removeEntry, clearHistory };
}
