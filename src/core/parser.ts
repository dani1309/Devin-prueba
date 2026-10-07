import { CalcError } from './errors';
import type { Operator, Token } from './tokenizer';

export type Node =
  | { type: 'number'; value: number }
  | { type: 'negate'; operand: Node }
  | { type: 'percent'; operand: Node }
  | { type: 'binary'; operator: Operator; left: Node; right: Node };

/**
 * Analizador descendente recursivo. Gramática (de menor a mayor precedencia):
 *
 *   expression := term (('+' | '-') term)*
 *   term       := unary (('*' | '/') unary)*
 *   unary      := ('+' | '-') unary | postfix
 *   postfix    := primary '%'*
 *   primary    := number | '(' expression ')'
 */
class Parser {
  private position = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): Node {
    if (this.tokens.length === 0) throw new CalcError('INCOMPLETE');
    const node = this.parseExpression();
    const extra = this.peek();
    if (extra) {
      throw new CalcError(extra.type === 'rparen' ? 'PARENTHESES' : 'INVALID');
    }
    return node;
  }

  private peek(): Token | undefined {
    return this.tokens[this.position];
  }

  private next(): Token | undefined {
    return this.tokens[this.position++];
  }

  private peekOperator(...operators: Operator[]): Operator | null {
    const token = this.peek();
    if (token?.type === 'operator' && operators.includes(token.value)) {
      return token.value;
    }
    return null;
  }

  private parseExpression(): Node {
    let left = this.parseTerm();
    let operator = this.peekOperator('+', '-');
    while (operator) {
      this.next();
      left = { type: 'binary', operator, left, right: this.parseTerm() };
      operator = this.peekOperator('+', '-');
    }
    return left;
  }

  private parseTerm(): Node {
    let left = this.parseUnary();
    let operator = this.peekOperator('*', '/');
    while (operator) {
      this.next();
      left = { type: 'binary', operator, left, right: this.parseUnary() };
      operator = this.peekOperator('*', '/');
    }
    return left;
  }

  private parseUnary(): Node {
    const operator = this.peekOperator('+', '-');
    if (operator) {
      this.next();
      const operand = this.parseUnary();
      return operator === '-' ? { type: 'negate', operand } : operand;
    }
    return this.parsePostfix();
  }

  private parsePostfix(): Node {
    let node = this.parsePrimary();
    while (this.peek()?.type === 'percent') {
      this.next();
      node = { type: 'percent', operand: node };
    }
    return node;
  }

  private parsePrimary(): Node {
    const token = this.next();
    if (!token) throw new CalcError('INCOMPLETE');

    if (token.type === 'number') {
      return { type: 'number', value: token.value };
    }

    if (token.type === 'lparen') {
      if (this.peek()?.type === 'rparen') throw new CalcError('INVALID');
      const inner = this.parseExpression();
      const closing = this.next();
      if (!closing) throw new CalcError('PARENTHESES');
      if (closing.type !== 'rparen') throw new CalcError('INVALID');
      return inner;
    }

    if (token.type === 'rparen') throw new CalcError('PARENTHESES');
    throw new CalcError('INVALID');
  }
}

export function parse(tokens: Token[]): Node {
  return new Parser(tokens).parse();
}
