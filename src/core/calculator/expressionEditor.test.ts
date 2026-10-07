import { describe, expect, it } from 'vitest';
import {
  appendDecimal,
  appendDigit,
  appendOperator,
  appendPostfix,
  appendText,
  backspace,
  closeOpenParens,
  countUnclosedParens,
  insertValue,
  prettifyExpression,
  toExpressionNumber,
  toggleSign,
} from './expressionEditor';
import { evaluateExpression } from '../math';

const type = (...steps: Array<(expression: string) => string>) => steps.reduce((expression, step) => step(expression), '');

describe('edición de la expresión', () => {
  it('evita ceros a la izquierda', () => {
    expect(appendDigit('0', '5')).toBe('5');
    expect(appendDigit('3+0', '7')).toBe('3+7');
    expect(appendDigit('0.', '5')).toBe('0.5');
  });

  it('permite un solo punto decimal por número', () => {
    expect(appendDecimal('3.5')).toBe('3.5');
    expect(appendDecimal('3.5+2')).toBe('3.5+2.');
    expect(appendDecimal('')).toBe('0.');
    expect(appendDecimal('3+')).toBe('3+0.');
  });

  it('reemplaza el operador final y permite signo negativo tras × o ÷', () => {
    expect(appendOperator('5+', '×')).toBe('5×');
    expect(appendOperator('5×', '−')).toBe('5×−');
    expect(appendOperator('5×−', '+')).toBe('5+');
    expect(appendOperator('5+', '−')).toBe('5−');
    expect(appendOperator('', '×')).toBe('');
    expect(appendOperator('', '−')).toBe('−');
    expect(appendOperator('(', '−')).toBe('(−');
    expect(appendOperator('5mod', '+')).toBe('5+');
    expect(appendOperator('5.', '+')).toBe('5+');
  });

  it('solo agrega % y ! después de un operando', () => {
    expect(appendPostfix('', '%')).toBe('');
    expect(appendPostfix('5+', '!')).toBe('5+');
    expect(appendPostfix('5', '!')).toBe('5!');
  });

  it('agrega × implícito antes de funciones y constantes', () => {
    expect(appendText('2', 'π')).toBe('2×π');
    expect(appendText('2+', 'sin(')).toBe('2+sin(');
  });

  it('borra funciones completas con backspace', () => {
    expect(backspace('2+sin⁻¹(')).toBe('2+');
    expect(backspace('10mod')).toBe('10');
    expect(backspace('123')).toBe('12');
    expect(backspace('')).toBe('');
  });

  it('cambia el signo del último operando', () => {
    expect(toggleSign('5')).toBe('(−5');
    expect(toggleSign('(−5')).toBe('5');
    expect(toggleSign('3×4')).toBe('3×(−4');
    expect(toggleSign('3×(−4')).toBe('3×4');
    expect(toggleSign('−5')).toBe('5');
    expect(toggleSign('2+sin(30)')).toBe('2+(−sin(30)');
    expect(toggleSign('')).toBe('−');
    expect(toggleSign('−')).toBe('');
  });

  it('cuenta y cierra paréntesis abiertos', () => {
    expect(countUnclosedParens('(5+(3')).toBe(2);
    expect(closeOpenParens('(5+(3')).toBe('(5+(3))');
  });

  it('convierte números en sintaxis reutilizable', () => {
    expect(toExpressionNumber(42)).toBe('42');
    expect(toExpressionNumber(-5)).toBe('(−5)');
    expect(toExpressionNumber(1.5e20)).toBe('(1.5×10^20)');
    expect(toExpressionNumber(-1.2e-7)).toBe('(−1.2×10^−7)');
    for (const value of [42, -5, 1.5e20, -1.2e-7, 0.25]) {
      expect(evaluateExpression(toExpressionNumber(value), { angleUnit: 'deg' })).toBeCloseTo(value, 20);
    }
  });

  it('inserta valores con multiplicación explícita', () => {
    expect(insertValue('100+', 42)).toBe('100+42');
    expect(insertValue('7', 2)).toBe('7×2');
    expect(insertValue('', -3)).toBe('(−3)');
  });

  it('formatea la expresión con espacios legibles', () => {
    expect(prettifyExpression('5+3×−2')).toBe('5 + 3 × −2');
    expect(prettifyExpression('−2^2')).toBe('−2^2');
    expect(prettifyExpression('10mod3')).toBe('10 mod 3');
  });

  it('simula una sesión de teclado completa', () => {
    const expression = type(
      (e) => appendDigit(e, '5'),
      (e) => appendOperator(e, '+'),
      (e) => appendDigit(e, '3'),
      (e) => appendOperator(e, '×'),
      (e) => appendDigit(e, '2'),
    );
    expect(evaluateExpression(expression, { angleUnit: 'deg' })).toBe(11);
  });
});
