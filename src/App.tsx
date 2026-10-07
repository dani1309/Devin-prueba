import { useCallback } from 'react';
import { Calculator } from './components/calculator/Calculator';
import { Toast } from './components/common/Toast';
import { CurrencyConverter } from './components/converters/CurrencyConverter';
import { PercentageCalculator } from './components/converters/PercentageCalculator';
import { UnitConverter } from './components/converters/UnitConverter';
import { SidePanel } from './components/history/SidePanel';
import { AppHeader } from './components/layout/AppHeader';
import { ViewTabs } from './components/layout/ViewTabs';
import type { HistoryEntry } from './core/history/types';
import { useCalculator } from './hooks/useCalculator';
import { useHistory } from './hooks/useHistory';
import { useMemory } from './hooks/useMemory';
import { usePreferences } from './hooks/usePreferences';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { preferences, updatePreference } = usePreferences();
  const { entries, addEntry, removeEntry, clearHistory } = useHistory();
  const { memory, runMemoryOperation } = useMemory();
  const { toast, notify } = useToast();
  const calculator = useCalculator({ angleUnit: preferences.angleUnit, onEvaluated: addEntry });

  const historyActions = {
    onLoadExpression: (entry: HistoryEntry) => calculator.loadExpression(entry.expression),
    onLoadResult: (entry: HistoryEntry) => calculator.loadResult(entry.result),
    onInsertResult: (entry: HistoryEntry) => calculator.insertValue(entry.result),
    onRerun: (entry: HistoryEntry) => {
      if (calculator.rerun(entry.expression, entry.angleUnit)) notify('Operación ejecutada de nuevo');
    },
    onDelete: (entry: HistoryEntry) => {
      removeEntry(entry.id);
      notify('Operación eliminada');
    },
  };

  const handleClearHistory = useCallback(() => {
    clearHistory();
    notify('Historial borrado');
  }, [clearHistory, notify]);

  return (
    <div className="app">
      <AppHeader theme={theme} onToggleTheme={toggleTheme} />
      <ViewTabs active={preferences.view} onChange={(view) => updatePreference('view', view)} />

      <main className="app__main">
        {preferences.view === 'calculator' && (
          <div className="calculator-layout">
            <Calculator
              calculator={calculator}
              mode={preferences.mode}
              angleUnit={preferences.angleUnit}
              memory={memory}
              keyboardEnabled
              onModeChange={(mode) => updatePreference('mode', mode)}
              onAngleUnitChange={(unit) => updatePreference('angleUnit', unit)}
              onMemoryOperation={runMemoryOperation}
              notify={notify}
            />
            <SidePanel entries={entries} onClear={handleClearHistory} {...historyActions} />
          </div>
        )}
        {preferences.view === 'units' && <UnitConverter />}
        {preferences.view === 'currency' && <CurrencyConverter />}
        {preferences.view === 'percentage' && <PercentageCalculator />}
      </main>

      <Toast toast={toast} />
    </div>
  );
}
