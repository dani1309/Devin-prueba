import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGES } from './errors';
import { evaluate } from './evaluate';
import { formatNumber } from './format';

const result = (expression: string) => formatNumber(evaluate(expression));

describe('evaluate', () => {
  it.each([
    ['2+3', '5'],
    ['10-4', '6'],
    ['6*7', '42'],
    ['8/2', '4'],
    ['7/2', '3.5'],
    ['1.5+2.25', '3.75'],
    ['.5+1', '1.5'],
    ['5.', '5'],
  ])('calcula operaciones básicas: %s = %s', (expression, expected) => {
    expect(result(expression)).toBe(expected);
  });

  it.each([
    ['2+3*4', '14'],
    ['10-6/2', '7'],
    ['2*3+4*5', '26'],
    ['10-2-3', '5'],
    ['100/10/2', '5'],
    ['(2+3)*4', '20'],
    ['2*(3+(4-1))', '12'],
    ['((1+2))', '3'],
  ])('respeta la jerarquía de operaciones: %s = %s', (expression, expected) => {
    expect(result(expression)).toBe(expected);
  });

  it.each([
    ['-5+3', '-2'],
    ['5*-2', '-10'],
    ['-(2+3)', '-5'],
    ['--4', '4'],
    ['2--3', '5'],
  ])('maneja números negativos: %s = %s', (expression, expected) => {
    expect(result(expression)).toBe(expected);
  });

  it.each([
    ['50%', '0.5'],
    ['200*10%', '20'],
    ['200+10%', '220'],
    ['200-10%', '180'],
    ['(100+100)%', '2'],
    ['10%%', '0.001'],
  ])('calcula porcentajes: %s = %s', (expression, expected) => {
    expect(result(expression)).toBe(expected);
  });

  it('corrige errores de coma flotante', () => {
    expect(result('0.1+0.2')).toBe('0.3');
    expect(result('1/3')).toBe('0.3333333333');
    expect(result('0.1*3')).toBe('0.3');
    expect(result('5-5.0')).toBe('0');
  });

  it.each([
    ['5/0', ERROR_MESSAGES.DIVISION_BY_ZERO],
    ['5/(2-2)', ERROR_MESSAGES.DIVISION_BY_ZERO],
    ['0/0', ERROR_MESSAGES.DIVISION_BY_ZERO],
    ['5+', ERROR_MESSAGES.INCOMPLETE],
    ['(5+', ERROR_MESSAGES.INCOMPLETE],
    ['', ERROR_MESSAGES.INCOMPLETE],
    ['(2+3', ERROR_MESSAGES.PARENTHESES],
    ['2+3)', ERROR_MESSAGES.PARENTHESES],
    [')', ERROR_MESSAGES.PARENTHESES],
    ['()', ERROR_MESSAGES.INVALID],
    ['5*/3', ERROR_MESSAGES.INVALID],
    ['1.2.3', ERROR_MESSAGES.INVALID],
    ['.', ERROR_MESSAGES.INVALID],
    ['2(3)', ERROR_MESSAGES.INVALID],
    ['abc', ERROR_MESSAGES.INVALID],
    ['999999999999999*10', ERROR_MESSAGES.OUT_OF_RANGE],
  ])('lanza un error amigable para "%s"', (expression, message) => {
    expect(() => evaluate(expression)).toThrow(message);
  });
});

describe('formatNumber', () => {
  it('no usa notación científica ni muestra -0', () => {
    expect(formatNumber(0.0000001)).toBe('0.0000001');
    expect(formatNumber(123456789012345)).toBe('123456789012345');
    expect(formatNumber(-0)).toBe('0');
    expect(formatNumber(-2.5)).toBe('-2.5');
  });
});
