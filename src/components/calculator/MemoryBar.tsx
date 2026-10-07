import type { MemoryOperation, MemoryValue } from '../../core/memory/memoryOperations';
import { KeyButton } from './KeyButton';

interface MemoryBarProps {
  memory: MemoryValue;
  onOperation: (operation: MemoryOperation) => void;
  onRecall: () => void;
}

export function MemoryBar({ memory, onOperation, onRecall }: MemoryBarProps) {
  const isEmpty = memory === null;
  return (
    <div className="memory-bar" role="group" aria-label="Memoria">
      <KeyButton variant="memory" label="MC" ariaLabel="Borrar memoria (MC)" onPress={() => onOperation('clear')} disabled={isEmpty} />
      <KeyButton variant="memory" label="MR" ariaLabel="Recuperar memoria (MR)" onPress={onRecall} disabled={isEmpty} />
      <KeyButton variant="memory" label="M+" ariaLabel="Sumar a memoria (M+)" onPress={() => onOperation('add')} />
      <KeyButton variant="memory" label="M−" ariaLabel="Restar de memoria (M−)" onPress={() => onOperation('subtract')} />
      <KeyButton variant="memory" label="MS" ariaLabel="Guardar en memoria (MS)" onPress={() => onOperation('store')} />
    </div>
  );
}
