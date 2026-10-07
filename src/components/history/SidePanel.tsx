import { useState } from 'react';
import type { HistoryEntry } from '../../core/history/types';
import { SegmentedControl } from '../common/SegmentedControl';
import { StatsPanel } from '../stats/StatsPanel';
import { HistoryPanel } from './HistoryPanel';
import type { HistoryItemActions } from './HistoryItem';
import './history.css';

type SideTab = 'history' | 'stats';

const TAB_OPTIONS = [
  { value: 'history', label: 'Historial' },
  { value: 'stats', label: 'Estadísticas' },
] as const;

interface SidePanelProps extends HistoryItemActions {
  entries: readonly HistoryEntry[];
  onClear: () => void;
}

export function SidePanel(props: SidePanelProps) {
  const [tab, setTab] = useState<SideTab>('history');

  return (
    <aside className="side-panel card" aria-label="Historial y estadísticas">
      <SegmentedControl label="Panel lateral" options={TAB_OPTIONS} value={tab} onChange={setTab} className="segmented--full" />
      <div className="side-panel__content">
        {tab === 'history' ? <HistoryPanel {...props} /> : <StatsPanel entries={props.entries} />}
      </div>
    </aside>
  );
}
