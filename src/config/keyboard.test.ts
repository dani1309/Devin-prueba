import { describe, expect, it } from 'vitest';
import { keyToAction } from './keyboard';
import { FUNCTIONS, OPERATORS, POSTFIX } from './symbols';

describe('keyToAction', () => {
  it('maps digits', () => {
    for (const d of '0123456789') expect(keyToAction(d)).toEqual({ type: 'digit', digit: d });
  });

  it('maps arithmetic operators to display symbols', () => {
    expect(keyToAction('+')).toEqual({ type: 'operator', operator: OPERATORS.add });
    expect(keyToAction('-')).toEqual({ type: 'operator', operator: OPERATORS.subtract });
    expect(keyToAction('*')).toEqual({ type: 'operator', operator: OPERATORS.multiply });
    expect(keyToAction('/')).toEqual({ type: 'operator', operator: OPERATORS.divide });
    expect(keyToAction('^')).toEqual({ type: 'operator', operator: OPERATORS.power });
  });

  it('maps both decimal separators', () => {
    expect(keyToAction('.')).toEqual({ type: 'decimal' });
    expect(keyToAction(',')).toEqual({ type: 'decimal' });
  });

  it('maps postfix, parentheses, constants and functions', () => {
    expect(keyToAction('%')).toEqual({ type: 'postfix', symbol: POSTFIX.percent });
    expect(keyToAction('!')).toEqual({ type: 'postfix', symbol: POSTFIX.factorial });
    expect(keyToAction('(')).toEqual({ type: 'openParen' });
    expect(keyToAction(')')).toEqual({ type: 'closeParen' });
    expect(keyToAction('p')).toEqual({ type: 'text', text: 'π' });
    expect(keyToAction('s')).toEqual({ type: 'text', text: FUNCTIONS.sqrt });
  });

  it('maps control keys', () => {
    expect(keyToAction('Enter')).toEqual({ type: 'evaluate' });
    expect(keyToAction('=')).toEqual({ type: 'evaluate' });
    expect(keyToAction('Backspace')).toEqual({ type: 'backspace' });
    expect(keyToAction('Escape')).toEqual({ type: 'clear' });
    expect(keyToAction('Delete')).toEqual({ type: 'clear' });
  });

  it('ignores unmapped keys', () => {
    expect(keyToAction('a')).toBeNull();
    expect(keyToAction('Shift')).toBeNull();
    expect(keyToAction('F5')).toBeNull();
  });
});
