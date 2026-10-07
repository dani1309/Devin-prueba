import { useMemo } from 'react';
import { prettifyExpression } from '../../core/calculator/expressionEditor';
import { computeHistoryStats } from '../../core/history/historyStats';
import type { HistoryEntry } from '../../core/history/types';
import { formatNumber } from '../../core/math';

export function StatsPanel({ entries }: { entries: readonly HistoryEntry[] }) {
  const stats = useMemo(() => computeHistoryStats(entries), [entries]);
  const number = (value: number | null) => (value === null ? '—' : formatNumber(value, { grouping: true }));

  return (
    <dl className="stats">
      <div className="stat stat--highlight">
        <dt className="stat__label">Total de operaciones</dt>
        <dd className="stat__value">{stats.total}</dd>
      </div>
      <div className="stat stat--wide">
        <dt className="stat__label">Última operación</dt>
        <dd className="stat__value stat__value--text">
          {stats.last ? `${prettifyExpression(stats.last.expression)} = ${number(stats.last.result)}` : '—'}
        </dd>
      </div>
      <div className="stat stat--wide">
        <dt className="stat__label">Operación más utilizada</dt>
        <dd className="stat__value stat__value--text">
          {stats.mostUsedOperation
            ? `${stats.mostUsedOperation.label} (${stats.mostUsedOperation.count} ${stats.mostUsedOperation.count === 1 ? 'vez' : 'veces'})`
            : '—'}
        </dd>
      </div>
      <div className="stat">
        <dt className="stat__label">Resultado máximo</dt>
        <dd className="stat__value">{number(stats.maxResult)}</dd>
      </div>
      <div className="stat">
        <dt className="stat__label">Resultado mínimo</dt>
        <dd className="stat__value">{number(stats.minResult)}</dd>
      </div>
    </dl>
  );
}
