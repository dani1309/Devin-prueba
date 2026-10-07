export type ParsedNumber = { ok: true; value: number } | { ok: false; error: string };

const NUMBER_INPUT = /^[-+]?(\d+([.,]\d*)?|[.,]\d+)$/;

export const EMPTY_INPUT_MESSAGE = 'Introduce un número';
export const INVALID_INPUT_MESSAGE = 'Introduce un número válido';

/** Parses user-typed numbers accepting `.` or `,` as decimal separator. */
export function parseNumberInput(raw: string): ParsedNumber {
  const text = raw.trim().replace(/\s/g, '');
  if (!text) return { ok: false, error: EMPTY_INPUT_MESSAGE };
  if (!NUMBER_INPUT.test(text)) return { ok: false, error: INVALID_INPUT_MESSAGE };
  const value = Number(text.replace(',', '.'));
  return Number.isFinite(value) ? { ok: true, value } : { ok: false, error: INVALID_INPUT_MESSAGE };
}
