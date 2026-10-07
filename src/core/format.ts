const DISPLAY_SYMBOLS: Record<string, string> = {
  '*': '×',
  '/': '÷',
  '-': '−',
};

/** Convierte un número en texto sin notación científica ni ceros sobrantes. */
export function formatNumber(value: number): string {
  if (value === 0 || Object.is(value, -0)) return '0';
  let text = value.toFixed(10);
  if (text.includes('.')) {
    text = text.replace(/0+$/, '').replace(/\.$/, '');
  }
  return text;
}

/** Convierte la expresión interna (ASCII) en la versión que se muestra en pantalla. */
export function formatExpression(expression: string): string {
  return expression.replace(/[*/-]/g, (symbol) => DISPLAY_SYMBOLS[symbol] ?? symbol);
}
