import { prettifyExpression } from '../../core/calculator/expressionEditor';
import type { HistoryEntry } from '../../core/history/types';
import { formatNumber } from '../../core/math';
import { formatDateTime } from '../../utils/date';
import { EqualsIcon, PlusIcon, RepeatIcon, TrashIcon, UploadIcon } from '../common/Icons';

export interface HistoryItemActions {
  onLoadExpression: (entry: HistoryEntry) => void;
  onLoadResult: (entry: HistoryEntry) => void;
  onInsertResult: (entry: HistoryEntry) => void;
  onRerun: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
}

const TRIG_PATTERN = /sin|cos|tan/;

export function HistoryItem({ entry, ...actions }: { entry: HistoryEntry } & HistoryItemActions) {
  const result = formatNumber(entry.result, { grouping: true });
  const actionButtons = [
    { label: 'Cargar operación', icon: <UploadIcon />, onClick: actions.onLoadExpression },
    { label: 'Recuperar solo el resultado', icon: <EqualsIcon />, onClick: actions.onLoadResult },
    { label: 'Usar resultado en la operación actual', icon: <PlusIcon />, onClick: actions.onInsertResult },
    { label: 'Volver a ejecutar', icon: <RepeatIcon />, onClick: actions.onRerun },
  ];

  return (
    <li className="history-item">
      <button
        type="button"
        className="history-item__main"
        onClick={() => actions.onLoadExpression(entry)}
        title="Cargar operación"
      >
        <span className="history-item__expression">{prettifyExpression(entry.expression)}</span>
        <span className="history-item__result">= {result}</span>
      </button>
      <div className="history-item__footer">
        <time className="history-item__date" dateTime={new Date(entry.createdAt).toISOString()}>
          {formatDateTime(entry.createdAt)}
          {TRIG_PATTERN.test(entry.expression) && <span className="badge badge--tiny">{entry.angleUnit.toUpperCase()}</span>}
        </time>
        <div className="history-item__actions">
          {actionButtons.map((action) => (
            <button
              key={action.label}
              type="button"
              className="icon-button icon-button--small"
              onClick={() => action.onClick(entry)}
              aria-label={`${action.label}: ${entry.expression}`}
              title={action.label}
            >
              {action.icon}
            </button>
          ))}
          <button
            type="button"
            className="icon-button icon-button--small icon-button--danger"
            onClick={() => actions.onDelete(entry)}
            aria-label={`Eliminar operación: ${entry.expression}`}
            title="Eliminar"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
}
