import { CalcError } from './errors';
import { applyBinary, applyFunction, ensureFinite, factorial, type AngleUnit } from './functions';
import type { Token } from './tokenizer';

interface Operand {
  value: number;
  /** True when the operand is a bare percentage such as `20%`, so `500 + 20%` means `500 + 500·20%`. */
  isPercent: boolean;
}

const startsOperand = (token: Token) =>
  token.type === 'number' || token.type === 'constant' || token.type === 'function' || token.type === 'leftParen';

/**
 * Recursive-descent parser that evaluates while parsing.
 *
 *   additive       := multiplicative (('+' | '-') multiplicative)*
 *   multiplicative := unary (('*' | '/' | 'mod') unary | <implicit ×> unary)*
 *   unary          := ('-' | '+') unary | power
 *   power          := postfix (('^' | 'root') unary)?
 *   postfix        := primary ('!' | '%')*
 *   primary        := number | constant | '(' additive ')' | function ('(' additive ')' | unary)
 *
 * Missing closing parentheses at the end of the input are closed automatically.
 */
export class ExpressionParser {
  private position = 0;
  private readonly tokens: Token[];
  private readonly angleUnit: AngleUnit;

  constructor(tokens: Token[], angleUnit: AngleUnit) {
    this.tokens = tokens;
    this.angleUnit = angleUnit;
  }

  parse(): number {
    if (this.tokens.length === 0) throw new CalcError('EMPTY');
    const result = this.parseAdditive();
    const leftover = this.peek();
    if (leftover) {
      throw new CalcError(leftover.type === 'rightParen' ? 'PARENTHESES' : 'INVALID');
    }
    return ensureFinite(result.value);
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private next(): Token | undefined {
    const token = this.tokens[this.position];
    this.position += 1;
    return token;
  }

  private parseAdditive(): Operand {
    let left = this.parseMultiplicative();
    for (let token = this.peek(); token?.type === 'operator'; token = this.peek()) {
      if (token.operator !== '+' && token.operator !== '-') break;
      this.position += 1;
      const right = this.parseMultiplicative();
      const rightValue = right.isPercent ? left.value * right.value : right.value;
      left = { value: applyBinary(token.operator, left.value, rightValue), isPercent: false };
    }
    return left;
  }

  private parseMultiplicative(): Operand {
    let left = this.parseUnary();
    for (let token = this.peek(); token; token = this.peek()) {
      if (token.type === 'operator' && (token.operator === '*' || token.operator === '/' || token.operator === 'mod')) {
        this.position += 1;
        const right = this.parseUnary();
        left = { value: applyBinary(token.operator, left.value, right.value), isPercent: false };
      } else if (startsOperand(token)) {
        const right = this.parseUnary();
        left = { value: applyBinary('*', left.value, right.value), isPercent: false };
      } else {
        break;
      }
    }
    return left;
  }

  private parseUnary(): Operand {
    const token = this.peek();
    if (token?.type === 'operator' && (token.operator === '-' || token.operator === '+')) {
      this.position += 1;
      const operand = this.parseUnary();
      return token.operator === '-' ? { ...operand, value: -operand.value } : operand;
    }
    return this.parsePower();
  }

  private parsePower(): Operand {
    const base = this.parsePostfix();
    const token = this.peek();
    if (token?.type === 'operator' && (token.operator === '^' || token.operator === 'root')) {
      this.position += 1;
      const exponent = this.parseUnary();
      return { value: applyBinary(token.operator, base.value, exponent.value), isPercent: false };
    }
    return base;
  }

  private parsePostfix(): Operand {
    let operand = this.parsePrimary();
    for (let token = this.peek(); token?.type === 'postfix'; token = this.peek()) {
      this.position += 1;
      operand =
        token.operator === '!'
          ? { value: factorial(operand.value), isPercent: false }
          : { value: operand.value / 100, isPercent: true };
    }
    return operand;
  }

  private parsePrimary(): Operand {
    const token = this.next();
    if (!token) throw new CalcError('INVALID');

    switch (token.type) {
      case 'number':
        return { value: token.value, isPercent: false };
      case 'constant':
        return { value: token.name === 'pi' ? Math.PI : Math.E, isPercent: false };
      case 'leftParen':
        return { value: this.parseGroup(), isPercent: false };
      case 'function': {
        const argument = this.peek()?.type === 'leftParen' ? (this.next(), this.parseGroup()) : this.parseUnary().value;
        return { value: applyFunction(token.name, argument, this.angleUnit), isPercent: false };
      }
      case 'rightParen':
        throw new CalcError('PARENTHESES');
      default:
        throw new CalcError('INVALID');
    }
  }

  /** Parses the inside of a group whose opening parenthesis was already consumed. */
  private parseGroup(): number {
    if (this.peek()?.type === 'rightParen') throw new CalcError('PARENTHESES');
    const inner = this.parseAdditive();
    const closing = this.peek();
    if (closing?.type === 'rightParen') {
      this.position += 1;
    } else if (closing) {
      throw new CalcError('INVALID');
    }
    return inner.value;
  }
}
