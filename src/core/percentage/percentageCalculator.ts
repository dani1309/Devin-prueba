import { formatNumber } from '../math';

export type PercentageMode = 'percentOf' | 'increase' | 'decrease' | 'difference' | 'ratio';

export interface PercentageModeConfig {
  id: PercentageMode;
  title: string;
  firstLabel: string;
  secondLabel: string;
}

export const PERCENTAGE_MODES: readonly PercentageModeConfig[] = [
  { id: 'percentOf', title: 'X% de una cantidad', firstLabel: 'Porcentaje (%)', secondLabel: 'Cantidad' },
  { id: 'increase', title: 'Aumentar X%', firstLabel: 'Cantidad', secondLabel: 'Aumento (%)' },
  { id: 'decrease', title: 'Reducir X%', firstLabel: 'Cantidad', secondLabel: 'Descuento (%)' },
  { id: 'difference', title: 'Diferencia porcentual', firstLabel: 'Valor inicial', secondLabel: 'Valor final' },
  { id: 'ratio', title: '¿Qué % es A de B?', firstLabel: 'Valor A', secondLabel: 'Valor B (total)' },
];

export type PercentageResult =
  | { ok: true; value: number; formatted: string; explanation: string }
  | { ok: false; error: string };

const fmt = (value: number) => formatNumber(value, { grouping: true });

export function calculatePercentage(mode: PercentageMode, first: number, second: number): PercentageResult {
  let value: number;
  let formatted: string;
  let explanation: string;

  switch (mode) {
    case 'percentOf':
      value = (first / 100) * second;
      formatted = fmt(value);
      explanation = `${fmt(first)}% de ${fmt(second)} = ${formatted}`;
      break;
    case 'increase':
      value = first * (1 + second / 100);
      formatted = fmt(value);
      explanation = `${fmt(first)} + ${fmt(second)}% = ${formatted}`;
      break;
    case 'decrease':
      value = first * (1 - second / 100);
      formatted = fmt(value);
      explanation = `${fmt(first)} − ${fmt(second)}% = ${formatted}`;
      break;
    case 'difference':
      if (first === 0) return { ok: false, error: 'El valor inicial no puede ser 0' };
      value = ((second - first) / Math.abs(first)) * 100;
      formatted = `${value > 0 ? '+' : ''}${fmt(value)}%`;
      explanation = `De ${fmt(first)} a ${fmt(second)}: ${value >= 0 ? 'aumento' : 'disminución'} de ${fmt(Math.abs(value))}%`;
      break;
    case 'ratio':
      if (second === 0) return { ok: false, error: 'No se puede dividir entre cero' };
      value = (first / second) * 100;
      formatted = `${fmt(value)}%`;
      explanation = `${fmt(first)} es el ${formatted} de ${fmt(second)}`;
      break;
  }

  if (!Number.isFinite(value)) return { ok: false, error: 'Resultado demasiado grande' };
  return { ok: true, value: Number(value.toPrecision(15)), formatted, explanation };
}
