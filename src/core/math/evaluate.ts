import { toUserMessage } from './errors';
import type { AngleUnit } from './functions';
import { ExpressionParser } from './parser';
import { tokenize } from './tokenizer';

const RESULT_PRECISION = 15;

export interface EvaluateOptions {
  angleUnit: AngleUnit;
}

export type EvaluationResult = { ok: true; value: number } | { ok: false; error: string };

/** Evaluates an expression and returns its value, throwing a `CalcError` on invalid input. */
export function evaluateExpression(expression: string, { angleUnit }: EvaluateOptions): number {
  const value = new ExpressionParser(tokenize(expression), angleUnit).parse();
  const rounded = Number(value.toPrecision(RESULT_PRECISION));
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function tryEvaluate(expression: string, options: EvaluateOptions): EvaluationResult {
  try {
    return { ok: true, value: evaluateExpression(expression, options) };
  } catch (error) {
    return { ok: false, error: toUserMessage(error) };
  }
}
