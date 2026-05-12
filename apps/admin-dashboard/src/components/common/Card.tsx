import type { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  description?: string;
  footer?: React.ReactNode;
  title?: string;
}>;

export function Card({ children, description, footer, title }: CardProps) {
  return (
    <section
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-lg)',
      }}
    >
      {title ? <h2>{title}</h2> : null}
      {description ? <p style={{ color: 'var(--color-text-secondary)' }}>{description}</p> : null}
      {children}
      {footer ? <footer style={{ marginTop: 'var(--spacing-lg)' }}>{footer}</footer> : null}
    </section>
  );
}
