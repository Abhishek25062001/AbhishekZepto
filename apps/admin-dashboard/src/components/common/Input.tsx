import { useId, type InputHTMLAttributes } from 'react';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  error?: string;
  label?: string;
  onChange?: (value: string) => void;
};

export function Input({ disabled = false, error, id, label, onChange, type = 'text', ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      {label ? <label htmlFor={inputId}>{label}</label> : null}
      <input
        {...props}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        disabled={disabled}
        id={inputId}
        onChange={(event) => onChange?.(event.target.value)}
        style={{
          background: disabled ? 'var(--color-background)' : 'var(--color-surface)',
          border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
          padding: 'var(--spacing-md)',
        }}
        type={type}
      />
      {error ? (
        <span id={errorId} style={{ color: 'var(--color-error)' }}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
