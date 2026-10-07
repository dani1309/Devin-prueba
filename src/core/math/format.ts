const DISPLAY_PRECISION = 12;
const MAX_PLAIN_INTEGER = 1e15;
const MAX_PLAIN_DECIMAL = 1e12;
const MIN_PLAIN_DECIMAL = 1e-6;
const GROUP_SEPARATOR = '\u202F';

export interface FormatOptions {
  /** Separates thousands with a narrow space (for display only, never for re-parsing). */
  grouping?: boolean;
}

function trimExponential(value: number): string {
  const [mantissa, exponent] = value.toExponential(DISPLAY_PRECISION - 1).split('e');
  const trimmedMantissa = mantissa.includes('.') ? mantissa.replace(/\.?0+$/, '') : mantissa;
  return `${trimmedMantissa}e${exponent}`;
}

function groupThousands(text: string): string {
  const [integer, decimals] = text.split('.');
  const sign = integer.startsWith('-') ? '-' : '';
  const digits = sign ? integer.slice(1) : integer;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
  return `${sign}${grouped}${decimals !== undefined ? `.${decimals}` : ''}`;
}

/** Formats a number for humans: rounds floating point noise and uses scientific notation for extremes. */
export function formatNumber(value: number, { grouping = false }: FormatOptions = {}): string {
  if (!Number.isFinite(value)) return '—';
  const normalized = Object.is(value, -0) ? 0 : value;
  const magnitude = Math.abs(normalized);

  let text: string;
  if (Number.isInteger(normalized) && magnitude < MAX_PLAIN_INTEGER) {
    text = String(normalized);
  } else if (magnitude !== 0 && (magnitude >= MAX_PLAIN_DECIMAL || magnitude < MIN_PLAIN_DECIMAL)) {
    return trimExponential(normalized);
  } else {
    text = String(Number(normalized.toPrecision(DISPLAY_PRECISION)));
  }

  return grouping ? groupThousands(text) : text;
}
