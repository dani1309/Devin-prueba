import type { ReactNode } from 'react';
import './converters.css';

interface ConverterLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ConverterLayout({ title, description, children }: ConverterLayoutProps) {
  return (
    <section className="converter card" aria-labelledby={`${title}-title`}>
      <header className="converter__header">
        <h2 id={`${title}-title`} className="converter__title">
          {title}
        </h2>
        <p className="converter__description">{description}</p>
      </header>
      {children}
    </section>
  );
}
