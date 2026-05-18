import { useQuery } from '@tanstack/react-query';

import { getAdminCities } from '../api/city.api';
import { LOCATION_STATUS } from '../constants/store.constants';

type CitySelectProps = {
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  value?: string | null;
  onChange: (nextId: string | undefined) => void;
};

export function CitySelect({
  disabled = false,
  error,
  id = 'city-select',
  label = 'City',
  value,
  onChange,
}: CitySelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-city-options'],
    queryFn: () =>
      getAdminCities({
        limit: 500,
        status: LOCATION_STATUS.ACTIVE,
        isServiceable: true,
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
        <option value="">Select city</option>
        {items.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
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
