import { useEffect, useRef } from 'react';
import { keyToAction, type KeyboardAction } from '../config/keyboard';

const isEditableTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** Buttons outside the keypad keep their native Enter behaviour (e.g. history actions, dialogs). */
const isForeignButton = (target: EventTarget | null) =>
  target instanceof HTMLElement && target.closest('button, a, [role="tab"]') !== null && !target.closest('[data-keypad]');

export function useKeyboardShortcuts(onAction: (action: KeyboardAction) => void, enabled: boolean) {
  const handlerRef = useRef(onAction);

  useEffect(() => {
    handlerRef.current = onAction;
  }, [onAction]);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return;
      if (isEditableTarget(event.target) || document.querySelector('dialog[open]')) return;

      const action = keyToAction(event.key);
      if (!action) return;
      if (action.type === 'evaluate' && event.key === 'Enter' && isForeignButton(event.target)) return;

      event.preventDefault();
      handlerRef.current(action);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
