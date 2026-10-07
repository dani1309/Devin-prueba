import { useState } from 'react';
import type { HistoryEntry } from '../../core/history/types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { TrashIcon } from '../common/Icons';
import { HistoryItem, type HistoryItemActions } from './HistoryItem';

interface HistoryPanelProps extends HistoryItemActions {
  entries: readonly HistoryEntry[];
  onClear: () => void;
}

export function HistoryPanel({ entries, onClear, ...actions }: HistoryPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="history">
      <div className="panel-header">
        <p className="panel-header__meta">
          {entries.length === 0 ? 'Sin operaciones' : `${entries.length} ${entries.length === 1 ? 'operación' : 'operaciones'}`}
        </p>
        <button
          type="button"
          className="button button--ghost button--small"
          onClick={() => setConfirmOpen(true)}
          disabled={entries.length === 0}
        >
          <TrashIcon /> Borrar historial
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">Aún no hay operaciones</p>
          <p className="empty-state__text">Cada cálculo que hagas aparecerá aquí y se guardará automáticamente.</p>
        </div>
      ) : (
        <ul className="history__list">
          {entries.map((entry) => (
            <HistoryItem key={entry.id} entry={entry} {...actions} />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="¿Borrar todo el historial?"
        message="Se eliminarán todas las operaciones guardadas. Esta acción no se puede deshacer."
        confirmLabel="Borrar todo"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onClear();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
