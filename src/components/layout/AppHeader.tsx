import type { Theme } from '../../hooks/useTheme';
import { MoonIcon, SunIcon } from '../common/Icons';

interface AppHeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function AppHeader({ theme, onToggleTheme }: AppHeaderProps) {
  const nextTheme = theme === 'dark' ? 'claro' : 'oscuro';
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true">
          ∑
        </span>
        <div>
          <h1 className="app-header__title">Calculadora Pro</h1>
          <p className="app-header__subtitle">Básica · Científica · Conversores</p>
        </div>
      </div>
      <button
        type="button"
        className="icon-button theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Cambiar a modo ${nextTheme}`}
        title={`Cambiar a modo ${nextTheme}`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}
