import { describe, expect, it } from 'vitest';
import { HISTORY_STORAGE_KEY, HistoryStore } from './historyStore';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe('HistoryStore', () => {
  it('guarda operaciones con el más reciente primero', () => {
    const store = new HistoryStore(new MemoryStorage());
    store.add('1+1', '2');
    store.add('2*3', '6');
    expect(store.getAll().map((entry) => entry.expression)).toEqual(['2*3', '1+1']);
  });

  it('persiste el historial entre instancias (al cerrar y abrir la app)', () => {
    const storage = new MemoryStorage();
    new HistoryStore(storage).add('5-2', '3');
    const reopened = new HistoryStore(storage);
    expect(reopened.getAll()).toHaveLength(1);
    expect(reopened.getAll()[0]).toMatchObject({ expression: '5-2', result: '3' });
  });

  it('elimina una operación individual', () => {
    const storage = new MemoryStorage();
    const store = new HistoryStore(storage);
    const first = store.add('1+1', '2');
    store.add('2+2', '4');
    store.remove(first.id);
    expect(store.getAll().map((entry) => entry.result)).toEqual(['4']);
    expect(new HistoryStore(storage).getAll()).toHaveLength(1);
  });

  it('borra todo el historial', () => {
    const storage = new MemoryStorage();
    const store = new HistoryStore(storage);
    store.add('1+1', '2');
    store.clear();
    expect(store.getAll()).toEqual([]);
    expect(new HistoryStore(storage).getAll()).toEqual([]);
  });

  it('limita la cantidad de operaciones guardadas', () => {
    const store = new HistoryStore(new MemoryStorage(), HISTORY_STORAGE_KEY, 3);
    for (let i = 0; i < 5; i++) store.add(`${i}+0`, `${i}`);
    expect(store.getAll().map((entry) => entry.result)).toEqual(['4', '3', '2']);
  });

  it('ignora datos corruptos en el almacenamiento', () => {
    const storage = new MemoryStorage();
    storage.setItem(HISTORY_STORAGE_KEY, '{no es json');
    expect(new HistoryStore(storage).getAll()).toEqual([]);

    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([{ foo: 1 }, { id: 'a', expression: '1+1', result: '2', createdAt: 1 }]));
    expect(new HistoryStore(storage).getAll()).toHaveLength(1);
  });

  it('funciona en memoria si no hay almacenamiento disponible', () => {
    const store = new HistoryStore(null);
    store.add('1+1', '2');
    expect(store.getAll()).toHaveLength(1);
  });
});
