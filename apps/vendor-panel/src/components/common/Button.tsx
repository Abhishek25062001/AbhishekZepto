import { useState, type ButtonHTMLAttributes, type CSSProperties, type PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
    size?: ButtonSize;
    variant?: ButtonVariant;
  }
>;

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  danger: {
    background: 'var(--color-error)',
    borderColor: 'var(--color-error)',
    color: 'var(--color-surface)',
  },
  ghost: {
    background: 'transparent',
    borderColor: 'transparent',
    color: 'var(--color-primary)',
  },
  outline: {
    background: 'transparent',
    borderColor: 'var(--color-primary)',
    color: 'var(--color-primary)',
  },
  primary: {
    background: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: 'var(--color-surface)',
  },
  secondary: {
    background: 'var(--color-primary-light)',
    borderColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  lg: {
    padding: 'var(--spacing-lg) var(--spacing-xl)',
  },
  md: {
    padding: 'var(--spacing-md) var(--spacing-lg)',
  },
  sm: {
    padding: 'var(--spacing-sm) var(--spacing-md)',
  },
};

export function Button({
  children,
  disabled,
  loading = false,
  onBlur,
  onFocus,
  size = 'md',
  style,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      onBlur={event => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      onFocus={event => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      style={{
        borderRadius: 'var(--radius-md)',
        borderStyle: 'solid',
        borderWidth: 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        minHeight: 44,
        opacity: isDisabled ? 0.7 : 1,
        outline: isFocused ? '2px solid var(--color-primary)' : '2px solid transparent',
        outlineOffset: 2,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      type={type}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
