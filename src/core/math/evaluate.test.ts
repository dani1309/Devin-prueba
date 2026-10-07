import { describe, expect, it } from 'vitest';
import { evaluateExpression, tryEvaluate, type EvaluateOptions } from './evaluate';
import { formatNumber } from './format';

const deg: EvaluateOptions = { angleUnit: 'deg' };
const rad: EvaluateOptions = { angleUnit: 'rad' };
const calc = (expression: string, options = deg) => evaluateExpression(expression, options);
const errorOf = (expression: string, options = deg) => {
  const result = tryEvaluate(expression, options);
  return result.ok ? null : result.error;
};

describe('operaciones básicas', () => {
  it.each([
    ['2 + 2', 4],
    ['10 - 5', 5],
    ['5 × 5', 25],
    ['10 / 2', 5],
    ['10 ÷ 4', 2.5],
    ['10.5 + 2.3', 12.8],
    ['0.1 + 0.2', 0.3],
    ['7−10', -3],
    ['5*3', 15],
  ])('%s = %s', (expression, expected) => {
    expect(calc(expression)).toBe(expected);
  });
});

describe('jerarquía de operaciones', () => {
  it.each([
    ['5 + 3 × 2', 11],
    ['(5 + 3) × 2', 16],
    ['2 + 3 × 4 − 6 ÷ 2', 11],
    ['2^3^2', 512],
    ['−2^2', -4],
    ['(−2)^2', 4],
    ['2^−1', 0.5],
    ['((2 + 3) × (4 − 1))^2', 225],
    ['2(3 + 4)', 14],
    ['(1+1)(2+2)', 8],
    ['2π', 2 * Math.PI],
  ])('%s = %s', (expression, expected) => {
    expect(calc(expression)).toBeCloseTo(expected, 12);
  });

  it('cierra automáticamente los paréntesis abiertos al final', () => {
    expect(calc('(5 + 3 × (2')).toBe(11);
  });
});

describe('porcentajes', () => {
  it.each([
    ['20%', 0.2],
    ['500 + 20%', 600],
    ['500 − 20%', 400],
    ['500 × 20%', 100],
    ['200 ÷ 50%', 400],
    ['50% × 2', 1],
  ])('%s = %s', (expression, expected) => {
    expect(calc(expression)).toBeCloseTo(expected, 12);
  });
});

describe('funciones científicas', () => {
  it.each([
    ['√(16)', 4],
    ['√9', 3],
    ['3ⁿ√27', 3],
    ['3ⁿ√(−8)', -2],
    ['4ⁿ√16', 2],
    ['log(1000)', 3],
    ['ln(e)', 1],
    ['exp(0)', 1],
    ['5!', 120],
    ['0!', 1],
    ['10 mod 3', 1],
    ['2^10', 1024],
    ['sin(30)', 0.5],
    ['cos(60)', 0.5],
    ['tan(45)', 1],
    ['sin(180)', 0],
    ['cos(90)', 0],
    ['sin⁻¹(0.5)', 30],
    ['cos⁻¹(0.5)', 60],
    ['tan⁻¹(1)', 45],
    ['π', Math.PI],
    ['e', Math.E],
    ['2 × (3 + (4 × (5 − 1)))', 38],
  ])('%s = %s (grados)', (expression, expected) => {
    expect(calc(expression)).toBeCloseTo(expected, 12);
  });

  it.each([
    ['sin(π/2)', 1],
    ['cos(π)', -1],
    ['sin(π)', 0],
    ['tan⁻¹(1)', Math.PI / 4],
  ])('%s = %s (radianes)', (expression, expected) => {
    expect(calc(expression, rad)).toBeCloseTo(expected, 12);
  });
});

describe('manejo de errores', () => {
  it.each([
    ['5 ÷ 0', 'No se puede dividir entre cero'],
    ['5 mod 0', 'No se puede dividir entre cero'],
    ['', 'Introduce una operación'],
    ['   ', 'Introduce una operación'],
    ['5 +', 'Operación no válida'],
    ['× 5', 'Operación no válida'],
    ['5 + + ', 'Operación no válida'],
    ['abc', 'Operación no válida'],
    ['5)', 'Paréntesis incorrectos'],
    ['()', 'Paréntesis incorrectos'],
    ['(5))', 'Paréntesis incorrectos'],
    ['(−3)!', 'Factorial no válido: usa enteros entre 0 y 170'],
    ['2.5!', 'Factorial no válido: usa enteros entre 0 y 170'],
    ['171!', 'Factorial no válido: usa enteros entre 0 y 170'],
    ['√(−4)', 'Raíz no válida para ese número'],
    ['2ⁿ√(−16)', 'Raíz no válida para ese número'],
    ['0ⁿ√5', 'Raíz no válida para ese número'],
    ['log(0)', 'Logaritmo no válido: usa valores mayores que 0'],
    ['ln(−1)', 'Logaritmo no válido: usa valores mayores que 0'],
    ['tan(90)', 'Valor fuera del dominio de la función'],
    ['sin⁻¹(2)', 'Valor fuera del dominio de la función'],
    ['10^400', 'Resultado demasiado grande'],
    ['170! × 170!', 'Resultado demasiado grande'],
    ['0^−1', 'No se puede dividir entre cero'],
  ])('%s → %s', (expression, message) => {
    expect(errorOf(expression)).toBe(message);
  });

  it('nunca devuelve NaN ni Infinity', () => {
    for (const expression of ['0 ÷ 0', '1e400', 'exp(1000)', '(−8)^(0.5)']) {
      const result = tryEvaluate(expression, deg);
      if (result.ok) expect(Number.isFinite(result.value)).toBe(true);
      else expect(result.error).not.toMatch(/NaN|Infinity|undefined/);
    }
  });
});

describe('formatNumber', () => {
  it.each([
    [0.1 + 0.2, '0.3'],
    [2 / 3, '0.666666666667'],
    [-0, '0'],
    [1099511627776, '1099511627776'],
    [1.5e20, '1.5e+20'],
    [0.0000001234, '1.234e-7'],
    [-42.5, '-42.5'],
  ])('%s → %s', (value, expected) => {
    expect(formatNumber(value)).toBe(expected);
  });

  it('agrupa miles solo para mostrar', () => {
    expect(formatNumber(1234567.89, { grouping: true })).toBe('1\u202F234\u202F567.89');
  });
});
