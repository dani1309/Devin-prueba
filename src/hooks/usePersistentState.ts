import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

export function usePersistentState<T>(
  key: string,
  fallback: T | (() => T),
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const initial = typeof fallback === 'function' ? (fallback as () => T)() : fallback;
    return readStorage(key, initial, isValid);
  });

  useEffect(() => {
    writeStorage(key, state);
  }, [key, state]);

  return [state, setState];
}
