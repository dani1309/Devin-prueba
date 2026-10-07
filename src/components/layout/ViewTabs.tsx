import type { AppView } from '../../hooks/usePreferences';

const VIEWS: ReadonlyArray<{ id: AppView; label: string; icon: string }> = [
  { id: 'calculator', label: 'Calculadora', icon: '±' },
  { id: 'units', label: 'Unidades', icon: '⇄' },
  { id: 'currency', label: 'Monedas', icon: '$' },
  { id: 'percentage', label: 'Porcentajes', icon: '%' },
];

interface ViewTabsProps {
  active: AppView;
  onChange: (view: AppView) => void;
}

export function ViewTabs({ active, onChange }: ViewTabsProps) {
  return (
    <nav className="view-tabs" aria-label="Secciones">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          className={`view-tabs__tab${view.id === active ? ' is-active' : ''}`}
          aria-current={view.id === active ? 'page' : undefined}
          onClick={() => onChange(view.id)}
        >
          <span className="view-tabs__icon" aria-hidden="true">
            {view.icon}
          </span>
          {view.label}
        </button>
      ))}
    </nav>
  );
}
