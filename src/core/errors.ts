export type CalcErrorCode =
  | 'DIVISION_BY_ZERO'
  | 'INVALID'
  | 'INCOMPLETE'
  | 'PARENTHESES'
  | 'OUT_OF_RANGE';

export const ERROR_MESSAGES: Record<CalcErrorCode, string> = {
  DIVISION_BY_ZERO: 'No se puede dividir entre cero',
  INVALID: 'Operación no válida',
  INCOMPLETE: 'Operación incompleta',
  PARENTHESES: 'Paréntesis incorrectos',
  OUT_OF_RANGE: 'Resultado demasiado grande',
};

export class CalcError extends Error {
  readonly code: CalcErrorCode;

  constructor(code: CalcErrorCode) {
    super(ERROR_MESSAGES[code]);
    this.name = 'CalcError';
    this.code = code;
  }
}

/** Devuelve un mensaje amigable para cualquier error, sin exponer detalles técnicos. */
export function toFriendlyMessage(error: unknown): string {
  return error instanceof CalcError ? error.message : ERROR_MESSAGES.INVALID;
}
