import { KEYBOARD_SHORTCUTS } from '../../config/keyboard';
import { KeyboardIcon } from '../common/Icons';

export function KeyboardHelp() {
  return (
    <details className="keyboard-help">
      <summary className="keyboard-help__summary">
        <KeyboardIcon /> Atajos de teclado
      </summary>
      <dl className="keyboard-help__list">
        {KEYBOARD_SHORTCUTS.map(([keys, description]) => (
          <div key={keys} className="keyboard-help__item">
            <dt>
              <kbd>{keys}</kbd>
            </dt>
            <dd>{description}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
