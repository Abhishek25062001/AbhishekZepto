import { useQuery } from '@tanstack/react-query';

import { getAdminBrands } from '../api/brand.api';

type BrandSelectProps = {
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  value?: string | null;
  onChange: (nextId: string | undefined) => void;
};

export function BrandSelect({
  disabled = false,
  error,
  id,
  label = 'Brand',
  value,
  onChange,
}: BrandSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-brand-options'],
    queryFn: () =>
      getAdminBrands({
        limit: 500,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
  });

  const items = data?.items ?? [];
  const errorId = error ? `${id ?? 'brand-select'}-error` : undefined;

  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <select
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        disabled={disabled || isLoading}
        id={id}
        value={value ?? ''}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next ? next : undefined);
        }}
        style={{
          borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-md)',
        }}
      >
        <option value="">No brand</option>
        {items.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} style={{ color: 'var(--color-error)' }}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
