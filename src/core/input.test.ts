import { describe, expect, it } from 'vitest';
import {
  appendDecimal,
  appendDigit,
  appendOperator,
  appendPercent,
  closeParenthesis,
  deleteLast,
  MAX_EXPRESSION_LENGTH,
  openParenthesis,
  toggleSign,
} from './input';

describe('appendDigit', () => {
  it('agrega dígitos y evita ceros a la izquierda', () => {
    expect(appendDigit('', '5')).toBe('5');
    expect(appendDigit('0', '0')).toBe('0');
    expect(appendDigit('0', '7')).toBe('7');
    expect(appendDigit('3+0', '4')).toBe('3+4');
    expect(appendDigit('0.', '0')).toBe('0.0');
  });

  it('inserta multiplicación implícita tras ")" o "%"', () => {
    expect(appendDigit('(2+3)', '4')).toBe('(2+3)*4');
    expect(appendDigit('50%', '2')).toBe('50%*2');
  });

  it('respeta la longitud máxima', () => {
    const long = '1'.repeat(MAX_EXPRESSION_LENGTH);
    expect(appendDigit(long, '2')).toBe(long);
  });
});

describe('appendDecimal', () => {
  it('permite un solo punto por número', () => {
    expect(appendDecimal('')).toBe('0.');
    expect(appendDecimal('3')).toBe('3.');
    expect(appendDecimal('3.5')).toBe('3.5');
    expect(appendDecimal('3.5+')).toBe('3.5+0.');
    expect(appendDecimal('(2)')).toBe('(2)*0.');
  });
});

describe('appendOperator', () => {
  it('agrega operadores tras un número', () => {
    expect(appendOperator('5', '+')).toBe('5+');
    expect(appendOperator('5.', '*')).toBe('5*');
    expect(appendOperator('(2)', '/')).toBe('(2)/');
  });

  it('reemplaza el operador anterior', () => {
    expect(appendOperator('5+', '*')).toBe('5*');
    expect(appendOperator('5*-', '+')).toBe('5+');
  });

  it('permite el signo negativo al inicio, tras "(" o tras × y ÷', () => {
    expect(appendOperator('', '-')).toBe('-');
    expect(appendOperator('', '+')).toBe('');
    expect(appendOperator('(', '-')).toBe('(-');
    expect(appendOperator('(', '*')).toBe('(');
    expect(appendOperator('5*', '-')).toBe('5*-');
    expect(appendOperator('-', '+')).toBe('');
    expect(appendOperator('(-', '*')).toBe('(');
  });
});

describe('paréntesis', () => {
  it('abre paréntesis con multiplicación implícita', () => {
    expect(openParenthesis('')).toBe('(');
    expect(openParenthesis('2+')).toBe('2+(');
    expect(openParenthesis('2')).toBe('2*(');
    expect(openParenthesis('(1)')).toBe('(1)*(');
  });

  it('solo cierra si hay un paréntesis abierto y un operando', () => {
    expect(closeParenthesis('2')).toBe('2');
    expect(closeParenthesis('(2+')).toBe('(2+');
    expect(closeParenthesis('(2+3')).toBe('(2+3)');
    expect(closeParenthesis('(2+3)')).toBe('(2+3)');
    expect(closeParenthesis('((2)')).toBe('((2))');
  });
});

describe('appendPercent', () => {
  it('solo agrega % tras un operando', () => {
    expect(appendPercent('50')).toBe('50%');
    expect(appendPercent('50%')).toBe('50%');
    expect(appendPercent('5+')).toBe('5+');
    expect(appendPercent('')).toBe('');
  });
});

describe('deleteLast', () => {
  it('borra el último carácter', () => {
    expect(deleteLast('12+3')).toBe('12+');
    expect(deleteLast('')).toBe('');
  });
});

describe('toggleSign', () => {
  it.each([
    ['', '-'],
    ['-', ''],
    ['5', '-5'],
    ['-5', '5'],
    ['2+5', '2-5'],
    ['2-5', '2+5'],
    ['2*5', '2*-5'],
    ['2*-5', '2*5'],
    ['(5', '(-5'],
    ['(-5', '(5'],
    ['2*(3+4)', '2*-(3+4)'],
    ['50%', '-50%'],
    ['3.5', '-3.5'],
    ['2*', '2*-'],
    ['2+', '2-'],
  ])('"%s" → "%s"', (input, expected) => {
    expect(toggleSign(input)).toBe(expected);
  });
});
