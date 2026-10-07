import { describe, expect, it } from 'vitest';
import { keyToInput } from './keyboard';

describe('keyToInput', () => {
  it.each([
    ['7', { type: 'digit', value: '7' }],
    ['+', { type: 'operator', value: '+' }],
    ['-', { type: 'operator', value: '-' }],
    ['*', { type: 'operator', value: '*' }],
    ['/', { type: 'operator', value: '/' }],
    ['Enter', { type: 'equals' }],
    ['Backspace', { type: 'backspace' }],
    ['Escape', { type: 'clear' }],
    ['(', { type: 'parenthesis', value: '(' }],
    [')', { type: 'parenthesis', value: ')' }],
    ['.', { type: 'decimal' }],
    ['%', { type: 'percent' }],
  ])('"%s" se traduce correctamente', (key, expected) => {
    expect(keyToInput(key)).toEqual(expected);
  });

  it('ignora teclas no relacionadas', () => {
    expect(keyToInput('a')).toBeNull();
    expect(keyToInput('Tab')).toBeNull();
  });
});
