import { useQuery } from '@tanstack/react-query';

import { getAdminProductUnits } from '../api/product-unit.api';
import { BASE_UNIT_LABELS } from '../constants/product-unit.constants';

type ProductUnitSelectProps = {
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  value?: string | null;
  onChange: (nextId: string | undefined) => void;
};

export function ProductUnitSelect({
  disabled = false,
  error,
  id,
  label = 'Unit',
  value,
  onChange,
}: ProductUnitSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-product-unit-options'],
    queryFn: () =>
      getAdminProductUnits({
        limit: 500,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
  });

  const items = data?.items ?? [];
  const errorId = error ? `${id ?? 'unit-select'}-error` : undefined;

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
        <option value="">Select a unit</option>
        {items.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name} ({unit.code}) · {BASE_UNIT_LABELS[unit.baseUnit]}
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
