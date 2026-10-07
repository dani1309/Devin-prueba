export type CalcErrorCode =
  | 'EMPTY'
  | 'INVALID'
  | 'DIVISION_BY_ZERO'
  | 'PARENTHESES'
  | 'OVERFLOW'
  | 'FACTORIAL'
  | 'ROOT'
  | 'LOGARITHM'
  | 'DOMAIN';

const ERROR_MESSAGES: Record<CalcErrorCode, string> = {
  EMPTY: 'Introduce una operación',
  INVALID: 'Operación no válida',
  DIVISION_BY_ZERO: 'No se puede dividir entre cero',
  PARENTHESES: 'Paréntesis incorrectos',
  OVERFLOW: 'Resultado demasiado grande',
  FACTORIAL: 'Factorial no válido: usa enteros entre 0 y 170',
  ROOT: 'Raíz no válida para ese número',
  LOGARITHM: 'Logaritmo no válido: usa valores mayores que 0',
  DOMAIN: 'Valor fuera del dominio de la función',
};

export class CalcError extends Error {
  readonly code: CalcErrorCode;

  constructor(code: CalcErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = 'CalcError';
    this.code = code;
  }
}

export function toUserMessage(error: unknown): string {
  return error instanceof CalcError ? error.message : ERROR_MESSAGES.INVALID;
}
