type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  error: {
    background: 'color-mix(in srgb, var(--color-error) 14%, var(--color-surface))',
    color: 'var(--color-error)',
  },
  info: {
    background: 'color-mix(in srgb, var(--color-info) 14%, var(--color-surface))',
    color: 'var(--color-info)',
  },
  neutral: {
    background: 'var(--color-background)',
    color: 'var(--color-text-secondary)',
  },
  success: {
    background: 'color-mix(in srgb, var(--color-success) 14%, var(--color-surface))',
    color: 'var(--color-success)',
  },
  warning: {
    background: 'color-mix(in srgb, var(--color-warning) 18%, var(--color-surface))',
    color: 'var(--color-warning)',
  },
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      style={{
        borderRadius: 'var(--radius-full)',
        display: 'inline-flex',
        fontSize: 12,
        fontWeight: 600,
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
