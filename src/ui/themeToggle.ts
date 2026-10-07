import { applyTheme, getInitialTheme, saveTheme, type Theme } from '../theme/theme';

export function initThemeToggle(button: HTMLButtonElement, storage: Storage | null): void {
  let theme: Theme = getInitialTheme(storage);

  const render = () => {
    applyTheme(theme);
    const label = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    button.setAttribute('aria-label', label);
    button.title = label;
  };

  button.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    saveTheme(storage, theme);
    render();
  });

  render();
}
