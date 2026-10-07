import { OPERATORS, POSTFIX } from '../../config/symbols';
import type { CalculatorController } from '../../hooks/useCalculator';
import { BackspaceIcon } from '../common/Icons';
import { KeyButton } from './KeyButton';

const DIGIT_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
] as const;

const ROW_OPERATORS = [
  { symbol: OPERATORS.divide, label: 'Dividir' },
  { symbol: OPERATORS.multiply, label: 'Multiplicar' },
  { symbol: OPERATORS.subtract, label: 'Restar' },
] as const;

export function BasicKeypad({ calculator }: { calculator: CalculatorController }) {
  return (
    <div className="keypad keypad--basic">
      <KeyButton variant="action" label="AC" ariaLabel="Limpiar todo" onPress={calculator.clear} />
      <KeyButton variant="function" label="(" ariaLabel="Abrir paréntesis" onPress={calculator.openParen} />
      <KeyButton variant="function" label=")" ariaLabel="Cerrar paréntesis" onPress={calculator.closeParen} />
      <KeyButton variant="action" label={<BackspaceIcon />} ariaLabel="Borrar un carácter" onPress={calculator.backspace} />

      {DIGIT_ROWS.map((row, index) => (
        <Row key={row.join('')} digits={row} operator={ROW_OPERATORS[index]} calculator={calculator} />
      ))}

      <KeyButton variant="number" label="±" ariaLabel="Cambiar signo" onPress={calculator.toggleSign} />
      <KeyButton variant="number" label="0" ariaLabel="0" onPress={() => calculator.inputDigit('0')} />
      <KeyButton variant="number" label="." ariaLabel="Punto decimal" onPress={calculator.inputDecimal} />
      <KeyButton variant="operator" label="+" ariaLabel="Sumar" onPress={() => calculator.inputOperator(OPERATORS.add)} />

      <KeyButton variant="function" label="%" ariaLabel="Porcentaje" onPress={() => calculator.inputPostfix(POSTFIX.percent)} />
      <KeyButton variant="equals" label="=" ariaLabel="Calcular resultado" onPress={calculator.evaluate} span={3} />
    </div>
  );
}

interface RowProps {
  digits: readonly string[];
  operator: { symbol: string; label: string };
  calculator: CalculatorController;
}

function Row({ digits, operator, calculator }: RowProps) {
  return (
    <>
      {digits.map((digit) => (
        <KeyButton key={digit} label={digit} ariaLabel={digit} onPress={() => calculator.inputDigit(digit)} />
      ))}
      <KeyButton
        variant="operator"
        label={operator.symbol}
        ariaLabel={operator.label}
        onPress={() => calculator.inputOperator(operator.symbol)}
      />
    </>
  );
}
