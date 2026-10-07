import { formatExpression } from '../core/format';
import type { HistoryEntry } from '../history/historyStore';
import { ICONS } from './dom';

export interface HistoryPanelElements {
  panel: HTMLElement;
  list: HTMLUListElement;
  empty: HTMLElement;
  clearButton: HTMLButtonElement;
  toggleButton: HTMLButtonElement;
  closeButton: HTMLButtonElement;
  backdrop: HTMLElement;
}

export interface HistoryPanelHandlers {
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

/** Panel lateral (o inferior en móvil) con las operaciones anteriores. */
export class HistoryPanel {
  private entries: readonly HistoryEntry[] = [];

  constructor(
    private readonly elements: HistoryPanelElements,
    private readonly handlers: HistoryPanelHandlers,
  ) {
    elements.list.addEventListener('click', (event) => this.handleListClick(event));
    elements.clearButton.addEventListener('click', () => {
      if (window.confirm('¿Borrar todo el historial?')) handlers.onClear();
    });
    elements.toggleButton.addEventListener('click', () => (this.isOpen() ? this.close() : this.open()));
    elements.closeButton.addEventListener('click', () => this.close());
    elements.backdrop.addEventListener('click', () => this.close());
  }

  render(entries: readonly HistoryEntry[]): void {
    this.entries = entries;
    const { list, empty, clearButton } = this.elements;
    list.replaceChildren(...entries.map((entry) => this.createItem(entry)));
    empty.hidden = entries.length > 0;
    clearButton.disabled = entries.length === 0;
  }

  isOpen(): boolean {
    return this.elements.panel.classList.contains('is-open');
  }

  open(): void {
    this.setOpen(true);
  }

  close(): void {
    this.setOpen(false);
  }

  private setOpen(open: boolean): void {
    this.elements.panel.classList.toggle('is-open', open);
    this.elements.backdrop.hidden = !open;
    this.elements.toggleButton.setAttribute('aria-expanded', String(open));
  }

  private createItem(entry: HistoryEntry): HTMLLIElement {
    const item = document.createElement('li');
    item.className = 'history__item';
    item.dataset.id = entry.id;

    const select = document.createElement('button');
    select.type = 'button';
    select.className = 'history__select';
    select.dataset.action = 'select';
    select.title = 'Usar esta operación';

    const expression = document.createElement('span');
    expression.className = 'history__expression';
    expression.textContent = formatExpression(entry.expression);

    const result = document.createElement('span');
    result.className = 'history__result';
    result.textContent = `= ${formatExpression(entry.result)}`;

    select.append(expression, result);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'icon-button history__delete';
    remove.dataset.action = 'remove';
    remove.setAttribute('aria-label', 'Eliminar operación');
    remove.title = 'Eliminar operación';
    remove.innerHTML = ICONS.trash;

    item.append(select, remove);
    return item;
  }

  private handleListClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>('button[data-action]');
    const id = button?.closest<HTMLElement>('.history__item')?.dataset.id;
    if (!button || !id) return;

    if (button.dataset.action === 'remove') {
      this.handlers.onRemove(id);
      return;
    }
    const entry = this.entries.find((candidate) => candidate.id === id);
    if (entry) {
      this.handlers.onSelect(entry);
      this.close();
    }
  }
}
