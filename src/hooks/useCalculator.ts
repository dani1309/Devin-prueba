import { useCallback, useMemo, useState } from 'react';
import * as editor from '../core/calculator/expressionEditor';
import { evaluateExpression, toUserMessage, tryEvaluate, type AngleUnit } from '../core/math';

interface CalculatorState {
  expression: string;
  /** Value of the last successful evaluation. */
  result: number | null;
  error: string | null;
  /** True right after `=`: the next digit starts a new expression, the next operator continues from the result. */
  justEvaluated: boolean;
}

const INITIAL_STATE: CalculatorState = { expression: '', result: null, error: null, justEvaluated: false };

type Transform = (expression: string) => string;

interface UseCalculatorOptions {
  angleUnit: AngleUnit;
  onEvaluated: (expression: string, result: number, angleUnit: AngleUnit) => void;
}

export function useCalculator({ angleUnit, onEvaluated }: UseCalculatorOptions) {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  const edit = useCallback((transform: Transform, continueFromResult = false) => {
    setState((current) => {
      let base = current.expression;
      if (current.justEvaluated) {
        base = continueFromResult && current.result !== null ? editor.toExpressionNumber(current.result) : '';
      }
      return { ...current, expression: transform(base), error: null, justEvaluated: false };
    });
  }, []);

  const runEvaluation = useCallback(
    (expression: string, unit: AngleUnit) => {
      try {
        const result = evaluateExpression(expression, { angleUnit: unit });
        const completeExpression = editor.closeOpenParens(expression);
        setState({ expression: completeExpression, result, error: null, justEvaluated: true });
        onEvaluated(completeExpression, result, unit);
        return true;
      } catch (error) {
        setState((current) => ({ ...current, expression, error: toUserMessage(error), justEvaluated: false }));
        return false;
      }
    },
    [onEvaluated],
  );

  const evaluate = useCallback(() => {
    if (state.justEvaluated) return;
    runEvaluation(state.expression, angleUnit);
  }, [state.justEvaluated, state.expression, angleUnit, runEvaluation]);

  const backspace = useCallback(() => {
    setState((current) =>
      current.justEvaluated
        ? { ...current, justEvaluated: false, error: null }
        : { ...current, expression: editor.backspace(current.expression), error: null },
    );
  }, []);

  const preview = useMemo(() => {
    if (state.justEvaluated || !state.expression) return null;
    const outcome = tryEvaluate(state.expression, { angleUnit });
    return outcome.ok ? outcome.value : null;
  }, [state.expression, state.justEvaluated, angleUnit]);

  /** The number currently represented on screen, used by the memory keys. */
  const currentValue = state.justEvaluated ? state.result : preview;

  const actions = useMemo(
    () => ({
      inputDigit: (digit: string) => edit((e) => editor.appendDigit(e, digit)),
      inputDecimal: () => edit(editor.appendDecimal),
      inputOperator: (operator: string) => edit((e) => editor.appendOperator(e, operator), true),
      inputPostfix: (symbol: string) => edit((e) => editor.appendPostfix(e, symbol), true),
      inputText: (text: string) => edit((e) => editor.appendText(e, text)),
      inputSuffix: (suffix: string) => edit((e) => (editor.endsWithOperand(e) ? e + suffix : e), true),
      openParen: () => edit(editor.appendOpenParen),
      closeParen: () => edit(editor.appendCloseParen),
      toggleSign: () => edit(editor.toggleSign, true),
      insertValue: (value: number) => edit((e) => editor.insertValue(e, value)),
      loadExpression: (expression: string) => setState({ ...INITIAL_STATE, expression }),
      loadResult: (value: number) => setState({ ...INITIAL_STATE, expression: editor.toExpressionNumber(value) }),
      clear: () => setState(INITIAL_STATE),
      backspace,
      evaluate,
      rerun: (expression: string, unit: AngleUnit) => runEvaluation(expression, unit),
    }),
    [edit, backspace, evaluate, runEvaluation],
  );

  return {
    expression: state.expression,
    result: state.result,
    error: state.error,
    justEvaluated: state.justEvaluated,
    preview,
    currentValue,
    ...actions,
  };
}

export type CalculatorController = ReturnType<typeof useCalculator>;
