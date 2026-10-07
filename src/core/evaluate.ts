import { CalcError } from './errors';
import { parse, type Node } from './parser';
import { tokenize } from './tokenizer';

/** Límite a partir del cual los números pierden precisión en coma flotante. */
export const MAX_ABS_VALUE = 1e15;

function checkRange(value: number): number {
  if (!Number.isFinite(value) || Math.abs(value) >= MAX_ABS_VALUE) {
    throw new CalcError('OUT_OF_RANGE');
  }
  return value;
}

function evaluateNode(node: Node): number {
  switch (node.type) {
    case 'number':
      return checkRange(node.value);
    case 'negate':
      return -evaluateNode(node.operand);
    case 'percent':
      return evaluateNode(node.operand) / 100;
    case 'binary': {
      const left = evaluateNode(node.left);
      const isAdditive = node.operator === '+' || node.operator === '-';
      // En sumas y restas, "a ± b%" significa "a ± (b% de a)", como en las calculadoras habituales.
      const right =
        isAdditive && node.right.type === 'percent'
          ? (left * evaluateNode(node.right.operand)) / 100
          : evaluateNode(node.right);

      switch (node.operator) {
        case '+':
          return checkRange(left + right);
        case '-':
          return checkRange(left - right);
        case '*':
          return checkRange(left * right);
        case '/':
          if (right === 0) throw new CalcError('DIVISION_BY_ZERO');
          return checkRange(left / right);
      }
    }
  }
}

/** Elimina los errores de redondeo de coma flotante (p. ej. 0.1 + 0.2). */
export function roundResult(value: number): number {
  const rounded = Number(Number(value.toPrecision(15)).toFixed(10));
  return rounded === 0 ? 0 : rounded;
}

/**
 * Evalúa una expresión respetando la jerarquía de operaciones.
 * Lanza un `CalcError` con un mensaje amigable si la expresión no es válida.
 */
export function evaluate(expression: string): number {
  const ast = parse(tokenize(expression));
  return checkRange(roundResult(evaluateNode(ast)));
}
