export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'calculadora.tema';

export function getInitialTheme(storage: Storage | null): Theme {
  try {
    const saved = storage?.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignorar: se usa la preferencia del sistema.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0f1115' : '#f3f4f8');
}

export function saveTheme(storage: Storage | null, theme: Theme): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignorar: el tema se mantiene solo durante la sesión.
  }
}
