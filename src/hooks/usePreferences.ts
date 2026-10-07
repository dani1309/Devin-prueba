import { useCallback } from 'react';
import { STORAGE_KEYS } from '../config/storage';
import type { AngleUnit } from '../core/math';
import { usePersistentState } from './usePersistentState';

export type CalculatorMode = 'basic' | 'scientific';
export type AppView = 'calculator' | 'units' | 'currency' | 'percentage';

export interface Preferences {
  mode: CalculatorMode;
  angleUnit: AngleUnit;
  view: AppView;
}

const DEFAULT_PREFERENCES: Preferences = { mode: 'basic', angleUnit: 'deg', view: 'calculator' };

const VIEWS: readonly AppView[] = ['calculator', 'units', 'currency', 'percentage'];

function isPreferences(value: unknown): value is Preferences {
  if (typeof value !== 'object' || value === null) return false;
  const prefs = value as Record<string, unknown>;
  return (
    (prefs.mode === 'basic' || prefs.mode === 'scientific') &&
    (prefs.angleUnit === 'deg' || prefs.angleUnit === 'rad') &&
    VIEWS.includes(prefs.view as AppView)
  );
}

export function usePreferences() {
  const [preferences, setPreferences] = usePersistentState(STORAGE_KEYS.preferences, DEFAULT_PREFERENCES, isPreferences);

  const updatePreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
      setPreferences((current) => ({ ...current, [key]: value })),
    [setPreferences],
  );

  return { preferences, updatePreference };
}
