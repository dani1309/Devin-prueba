import { describe, expect, it } from 'vitest';
import { applyMemoryOperation } from './memoryOperations';

describe('applyMemoryOperation', () => {
  it('MS, M+, M− y MC', () => {
    let memory = applyMemoryOperation(null, 'store', 10);
    expect(memory).toBe(10);
    memory = applyMemoryOperation(memory, 'add', 5);
    expect(memory).toBe(15);
    memory = applyMemoryOperation(memory, 'subtract', 20);
    expect(memory).toBe(-5);
    expect(applyMemoryOperation(memory, 'clear', 0)).toBeNull();
  });

  it('M+ sobre memoria vacía parte de 0', () => {
    expect(applyMemoryOperation(null, 'add', 0.1)).toBe(0.1);
    expect(applyMemoryOperation(0.1, 'add', 0.2)).toBe(0.3);
  });
});
