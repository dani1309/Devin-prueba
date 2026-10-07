import { useState } from 'react';
import { CONSTANTS, FUNCTIONS, OPERATORS, POSTFIX } from '../../config/symbols';
import type { AngleUnit } from '../../core/math';
import type { CalculatorController } from '../../hooks/useCalculator';
import { KeyButton } from './KeyButton';

interface ScientificKeypadProps {
  calculator: CalculatorController;
  angleUnit: AngleUnit;
  onAngleUnitChange: (unit: AngleUnit) => void;
}

interface ScientificKey {
  label: string;
  ariaLabel: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ScientificKeypad({ calculator, angleUnit, onAngleUnitChange }: ScientificKeypadProps) {
  const [inverse, setInverse] = useState(false);
  const { inputText, inputOperator, inputSuffix, inputPostfix } = calculator;

  const trig = (name: 'sin' | 'cos' | 'tan', spanishName: string): ScientificKey => {
    const inverseName = `a${name}` as const;
    return inverse
      ? { label: `${name}⁻¹`, ariaLabel: `Arco${spanishName}`, onPress: () => inputText(FUNCTIONS[inverseName]) }
      : { label: name, ariaLabel: spanishName[0].toUpperCase() + spanishName.slice(1), onPress: () => inputText(FUNCTIONS[name]) };
  };

  const keys: ScientificKey[] = [
    trig('sin', 'seno'),
    trig('cos', 'coseno'),
    trig('tan', 'tangente'),
    { label: 'x²', ariaLabel: 'Cuadrado', onPress: () => inputSuffix('^2') },
    { label: 'x³', ariaLabel: 'Cubo', onPress: () => inputSuffix('^3') },
    { label: 'xʸ', ariaLabel: 'Potencia', onPress: () => inputOperator(OPERATORS.power) },
    { label: '√', ariaLabel: 'Raíz cuadrada', onPress: () => inputText(FUNCTIONS.sqrt) },
    { label: 'ⁿ√x', ariaLabel: 'Raíz de índice n (índice ⁿ√ número, ej. 3ⁿ√27)', onPress: () => inputOperator(OPERATORS.nthRoot) },
    { label: 'log', ariaLabel: 'Logaritmo base 10', onPress: () => inputText(FUNCTIONS.log) },
    { label: 'ln', ariaLabel: 'Logaritmo natural', onPress: () => inputText(FUNCTIONS.ln) },
    { label: 'eˣ', ariaLabel: 'Exponencial', onPress: () => inputText(FUNCTIONS.exp) },
    { label: '10ˣ', ariaLabel: 'Diez elevado a x', onPress: () => inputText(`10${OPERATORS.power}`) },
    { label: 'n!', ariaLabel: 'Factorial', onPress: () => inputPostfix(POSTFIX.factorial) },
    { label: '1/x', ariaLabel: 'Inverso', onPress: () => inputSuffix(`${OPERATORS.power}(${OPERATORS.subtract}1)`) },
    { label: 'mod', ariaLabel: 'Módulo', onPress: () => inputOperator(OPERATORS.mod) },
    { label: 'π', ariaLabel: 'Pi', onPress: () => inputText(CONSTANTS.pi) },
    { label: 'e', ariaLabel: 'Número e', onPress: () => inputText(CONSTANTS.e) },
    {
      label: 'Ans',
      ariaLabel: 'Último resultado',
      onPress: () => calculator.result !== null && calculator.insertValue(calculator.result),
      disabled: calculator.result === null,
    },
  ];

  return (
    <div className="keypad keypad--scientific">
      <KeyButton
        variant="toggle"
        label="INV"
        ariaLabel="Funciones inversas"
        active={inverse}
        onPress={() => setInverse((value) => !value)}
      />
      <KeyButton
        variant="toggle"
        label={angleUnit === 'deg' ? 'DEG' : 'RAD'}
        ariaLabel={`Unidad de ángulo: ${angleUnit === 'deg' ? 'grados' : 'radianes'}. Pulsa para cambiar`}
        onPress={() => onAngleUnitChange(angleUnit === 'deg' ? 'rad' : 'deg')}
      />
      {keys.map((key) => (
        <KeyButton key={key.ariaLabel} variant="function" {...key} />
      ))}
    </div>
  );
}
