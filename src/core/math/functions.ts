import { CalcError } from './errors';
import type { BinaryOperator, FunctionName } from './tokenizer';

export type AngleUnit = 'deg' | 'rad';

const MAX_FACTORIAL = 170;
const TRIG_EPSILON = 1e-14;
const INTEGER_EPSILON = 1e-9;

export function ensureFinite(value: number): number {
  if (Number.isNaN(value)) throw new CalcError('INVALID');
  if (!Number.isFinite(value)) throw new CalcError('OVERFLOW');
  return value;
}

const isNearlyInteger = (value: number) => Math.abs(value - Math.round(value)) < INTEGER_EPSILON;
const snapToZero = (value: number) => (Math.abs(value) < TRIG_EPSILON ? 0 : value);

export function factorial(value: number): number {
  if (value < 0 || value > MAX_FACTORIAL || !isNearlyInteger(value)) {
    throw new CalcError('FACTORIAL');
  }
  let result = 1;
  for (let n = 2; n <= Math.round(value); n += 1) result *= n;
  return result;
}

export function power(base: number, exponent: number): number {
  if (base === 0 && exponent < 0) throw new CalcError('DIVISION_BY_ZERO');
  const result = Math.pow(base, exponent);
  if (Number.isNaN(result)) throw new CalcError('DOMAIN');
  return ensureFinite(result);
}

/** Real n-th root of `radicand`, e.g. nthRoot(3, 27) = 3 and nthRoot(3, -8) = -2. */
export function nthRoot(index: number, radicand: number): number {
  if (index === 0) throw new CalcError('ROOT');
  const isOddInteger = isNearlyInteger(index) && Math.abs(Math.round(index)) % 2 === 1;

  if (radicand < 0 && !isOddInteger) throw new CalcError('ROOT');

  const magnitude = Math.pow(Math.abs(radicand), 1 / index);
  const rounded = Math.round(magnitude);
  const exact = isNearlyInteger(index) && Math.pow(rounded, index) === Math.abs(radicand) ? rounded : magnitude;
  return ensureFinite(radicand < 0 ? -exact : exact);
}

export function applyBinary(operator: BinaryOperator, left: number, right: number): number {
  switch (operator) {
    case '+':
      return ensureFinite(left + right);
    case '-':
      return ensureFinite(left - right);
    case '*':
      return ensureFinite(left * right);
    case '/':
      if (right === 0) throw new CalcError('DIVISION_BY_ZERO');
      return ensureFinite(left / right);
    case 'mod':
      if (right === 0) throw new CalcError('DIVISION_BY_ZERO');
      return ensureFinite(left % right);
    case '^':
      return power(left, right);
    case 'root':
      return nthRoot(left, right);
  }
}

const toRadians = (value: number, unit: AngleUnit) => (unit === 'deg' ? (value * Math.PI) / 180 : value);
const fromRadians = (value: number, unit: AngleUnit) => (unit === 'deg' ? (value * 180) / Math.PI : value);

function tangent(value: number, unit: AngleUnit): number {
  if (unit === 'deg') {
    const reduced = ((value % 180) + 180) % 180;
    if (reduced === 90) throw new CalcError('DOMAIN');
    if (reduced === 0) return 0;
  }
  const radians = toRadians(value, unit);
  if (Math.abs(Math.cos(radians)) < TRIG_EPSILON) throw new CalcError('DOMAIN');
  return snapToZero(Math.tan(radians));
}

function sine(value: number, unit: AngleUnit): number {
  if (unit === 'deg' && value % 180 === 0) return 0;
  return snapToZero(Math.sin(toRadians(value, unit)));
}

function cosine(value: number, unit: AngleUnit): number {
  if (unit === 'deg' && (value - 90) % 180 === 0) return 0;
  return snapToZero(Math.cos(toRadians(value, unit)));
}

function inverseTrig(fn: (x: number) => number, value: number, unit: AngleUnit, bounded: boolean): number {
  if (bounded && (value < -1 || value > 1)) throw new CalcError('DOMAIN');
  return fromRadians(fn(value), unit);
}

export function applyFunction(name: FunctionName, value: number, angleUnit: AngleUnit): number {
  switch (name) {
    case 'sin':
      return sine(value, angleUnit);
    case 'cos':
      return cosine(value, angleUnit);
    case 'tan':
      return tangent(value, angleUnit);
    case 'asin':
      return inverseTrig(Math.asin, value, angleUnit, true);
    case 'acos':
      return inverseTrig(Math.acos, value, angleUnit, true);
    case 'atan':
      return inverseTrig(Math.atan, value, angleUnit, false);
    case 'log':
      if (value <= 0) throw new CalcError('LOGARITHM');
      return Math.log10(value);
    case 'ln':
      if (value <= 0) throw new CalcError('LOGARITHM');
      return Math.log(value);
    case 'sqrt':
      if (value < 0) throw new CalcError('ROOT');
      return Math.sqrt(value);
    case 'exp':
      return ensureFinite(Math.exp(value));
  }
}
