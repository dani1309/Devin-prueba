import './styles/theme.css';
import './styles/base.css';
import './styles/calculator.css';
import './styles/history.css';

import { Calculator } from './core/calculator';
import { getBrowserStorage, HistoryStore } from './history/historyStore';
import { Display } from './ui/display';
import { getElement } from './ui/dom';
import { HistoryPanel } from './ui/historyPanel';
import { attachKeyboard } from './ui/keyboard';
import { Keypad } from './ui/keypad';
import { initThemeToggle } from './ui/themeToggle';

const storage = getBrowserStorage();
const history = new HistoryStore(storage);
const calculator = new Calculator((expression, result) => history.add(expression, result));

const display = new Display(
  getElement('display'),
  getElement('display-expression'),
  getElement('display-result'),
);
calculator.subscribe((state) => display.render(state));

const keypad = new Keypad(getElement('keypad'), (input) => calculator.press(input));

const historyPanel = new HistoryPanel(
  {
    panel: getElement('history-panel'),
    list: getElement<HTMLUListElement>('history-list'),
    empty: getElement('history-empty'),
    clearButton: getElement<HTMLButtonElement>('history-clear'),
    toggleButton: getElement<HTMLButtonElement>('history-toggle'),
    closeButton: getElement<HTMLButtonElement>('history-close'),
    backdrop: getElement('history-backdrop'),
  },
  {
    onSelect: (entry) => calculator.load(entry.expression),
    onRemove: (id) => history.remove(id),
    onClear: () => history.clear(),
  },
);
history.subscribe((entries) => historyPanel.render(entries));

attachKeyboard((input) => {
  if (input.type === 'clear' && historyPanel.isOpen()) {
    historyPanel.close();
    return;
  }
  keypad.flash(input);
  calculator.press(input);
});

initThemeToggle(getElement<HTMLButtonElement>('theme-toggle'), storage);
