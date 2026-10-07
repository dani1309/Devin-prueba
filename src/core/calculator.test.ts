import { describe, expect, it, vi } from 'vitest';
import { Calculator, type CalculatorInput } from './calculator';

function type(calculator: Calculator, keys: string): void {
  for (const key of keys) {
    let input: CalculatorInput;
    if (/\d/.test(key)) input = { type: 'digit', value: key };
    else if (key === '.') input = { type: 'decimal' };
    else if (key === '%') input = { type: 'percent' };
    else if (key === '(' || key === ')') input = { type: 'parenthesis', value: key };
    else if (key === '=') input = { type: 'equals' };
    else if (key === '+' || key === '-' || key === '*' || key === '/') input = { type: 'operator', value: key };
    else throw new Error(`Tecla no soportada: ${key}`);
    calculator.press(input);
  }
}

describe('Calculator', () => {
  it('muestra una vista previa mientras se escribe', () => {
    const calculator = new Calculator();
    type(calculator, '2+3*4');
    expect(calculator.getState()).toMatchObject({ expression: '2+3*4', preview: '14', result: null });
  });

  it('no muestra vista previa para un número solo', () => {
    const calculator = new Calculator();
    type(calculator, '42');
    expect(calculator.getState().preview).toBeNull();
  });

  it('calcula el resultado y notifica para guardar en el historial', () => {
    const onEvaluate = vi.fn();
    const calculator = new Calculator(onEvaluate);
    type(calculator, '(2+3)*4=');
    expect(calculator.getState()).toMatchObject({ result: '20', error: null });
    expect(onEvaluate).toHaveBeenCalledWith('(2+3)*4', '20');
  });

  it('no guarda en el historial ni repite al pulsar = dos veces', () => {
    const onEvaluate = vi.fn();
    const calculator = new Calculator(onEvaluate);
    type(calculator, '1+1==');
    expect(onEvaluate).toHaveBeenCalledTimes(1);
  });

  it('ignora = con la pantalla vacía', () => {
    const onEvaluate = vi.fn();
    const calculator = new Calculator(onEvaluate);
    type(calculator, '=');
    expect(calculator.getState()).toMatchObject({ result: null, error: null });
    expect(onEvaluate).not.toHaveBeenCalled();
  });

  it('muestra mensajes amigables en caso de error y no los guarda', () => {
    const onEvaluate = vi.fn();
    const calculator = new Calculator(onEvaluate);
    type(calculator, '5/0=');
    expect(calculator.getState().error).toBe('No se puede dividir entre cero');

    calculator.press({ type: 'clear' });
    type(calculator, '(2+3=');
    expect(calculator.getState().error).toBe('Paréntesis incorrectos');

    calculator.press({ type: 'clear' });
    type(calculator, '2+=');
    expect(calculator.getState().error).toBe('Operación incompleta');
    expect(onEvaluate).not.toHaveBeenCalled();
  });

  it('permite corregir la expresión tras un error', () => {
    const calculator = new Calculator();
    type(calculator, '(2+3=');
    type(calculator, ')=');
    expect(calculator.getState()).toMatchObject({ expression: '(2+3)', result: '5', error: null });
  });

  it('continúa desde el resultado con un operador y empieza de nuevo con un número', () => {
    const calculator = new Calculator();
    type(calculator, '2+3=*2');
    expect(calculator.getState().expression).toBe('5*2');

    type(calculator, '=7');
    expect(calculator.getState().expression).toBe('7');
  });

  it('cambia el signo y borra caracteres', () => {
    const calculator = new Calculator();
    type(calculator, '12');
    calculator.press({ type: 'toggleSign' });
    expect(calculator.getState().expression).toBe('-12');
    calculator.press({ type: 'backspace' });
    expect(calculator.getState().expression).toBe('-1');
  });

  it('carga una operación del historial', () => {
    const calculator = new Calculator();
    calculator.load('7*6');
    expect(calculator.getState()).toMatchObject({ expression: '7*6', preview: '42', result: null });
  });

  it('notifica a los suscriptores en cada cambio', () => {
    const calculator = new Calculator();
    const listener = vi.fn();
    calculator.subscribe(listener);
    type(calculator, '1');
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ expression: '1' }));
  });
});
