import { useCallback } from 'react';
import { STORAGE_KEYS } from '../config/storage';
import { applyMemoryOperation, isMemoryValue, type MemoryOperation, type MemoryValue } from '../core/memory/memoryOperations';
import { toUserMessage } from '../core/math';
import { usePersistentState } from './usePersistentState';

export type MemoryOutcome = { ok: true; memory: MemoryValue } | { ok: false; error: string };

export function useMemory() {
  const [memory, setMemory] = usePersistentState<MemoryValue>(STORAGE_KEYS.memory, null, isMemoryValue);

  const runMemoryOperation = useCallback(
    (operation: MemoryOperation, value: number): MemoryOutcome => {
      try {
        const next = applyMemoryOperation(memory, operation, value);
        setMemory(next);
        return { ok: true, memory: next };
      } catch (error) {
        return { ok: false, error: toUserMessage(error) };
      }
    },
    [memory, setMemory],
  );

  return { memory, runMemoryOperation };
}
