import type { ReactNode } from 'react';

export type KeyVariant = 'number' | 'operator' | 'function' | 'action' | 'equals' | 'memory' | 'toggle';

interface KeyButtonProps {
  label: ReactNode;
  ariaLabel: string;
  onPress: () => void;
  variant?: KeyVariant;
  span?: 2 | 3;
  disabled?: boolean;
  active?: boolean;
  title?: string;
}

export function KeyButton({ label, ariaLabel, onPress, variant = 'number', span, disabled, active, title }: KeyButtonProps) {
  const classes = ['key', `key--${variant}`, span ? `key--span-${span}` : '', active ? 'is-active' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-label={ariaLabel}
      aria-pressed={active === undefined ? undefined : active}
      title={title ?? ariaLabel}
      disabled={disabled}
      onClick={onPress}
    >
      {label}
    </button>
  );
}
