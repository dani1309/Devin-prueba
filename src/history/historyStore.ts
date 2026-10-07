export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  createdAt: number;
}

type HistoryListener = (entries: readonly HistoryEntry[]) => void;

export const HISTORY_STORAGE_KEY = 'calculadora.historial';
export const HISTORY_LIMIT = 50;

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.expression === 'string' &&
    typeof entry.result === 'string' &&
    typeof entry.createdAt === 'number'
  );
}

/** Historial de operaciones persistido en `localStorage` (el más reciente primero). */
export class HistoryStore {
  private entries: HistoryEntry[];
  private readonly listeners = new Set<HistoryListener>();

  constructor(
    private readonly storage: Storage | null,
    private readonly key = HISTORY_STORAGE_KEY,
    private readonly limit = HISTORY_LIMIT,
  ) {
    this.entries = this.load();
  }

  getAll(): readonly HistoryEntry[] {
    return this.entries;
  }

  subscribe(listener: HistoryListener): () => void {
    this.listeners.add(listener);
    listener(this.entries);
    return () => this.listeners.delete(listener);
  }

  add(expression: string, result: string): HistoryEntry {
    const entry: HistoryEntry = { id: createId(), expression, result, createdAt: Date.now() };
    this.update([entry, ...this.entries].slice(0, this.limit));
    return entry;
  }

  remove(id: string): void {
    this.update(this.entries.filter((entry) => entry.id !== id));
  }

  clear(): void {
    this.update([]);
  }

  private update(entries: HistoryEntry[]): void {
    this.entries = entries;
    this.save();
    this.listeners.forEach((listener) => listener(this.entries));
  }

  private load(): HistoryEntry[] {
    try {
      const raw = this.storage?.getItem(this.key);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isHistoryEntry).slice(0, this.limit) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    try {
      this.storage?.setItem(this.key, JSON.stringify(this.entries));
    } catch {
      // Si el almacenamiento no está disponible, el historial sigue funcionando en memoria.
    }
  }
}

/** Devuelve `localStorage` si está disponible (puede estar bloqueado en modo privado). */
export function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
