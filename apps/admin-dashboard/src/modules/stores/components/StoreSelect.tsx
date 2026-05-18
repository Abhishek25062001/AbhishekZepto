import { useQuery } from '@tanstack/react-query';

import { getAdminStores } from '../api/store.api';
import { STORE_STATUS } from '../constants/store.constants';

type StoreSelectProps = {
  cityId?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  value?: string | null;
  onChange: (nextId: string | undefined) => void;
};

export function StoreSelect({
  cityId,
  disabled = false,
  error,
  id = 'store-select',
  label = 'Store',
  value,
  onChange,
}: StoreSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-store-options', cityId],
    queryFn: () =>
      getAdminStores({
        cityId,
        limit: 500,
        status: STORE_STATUS.ACTIVE,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
  });

  const items = data?.items ?? [];
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor={id}>{label}</label>
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
        <option value="">Select store</option>
        {items.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name} ({store.code})
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
