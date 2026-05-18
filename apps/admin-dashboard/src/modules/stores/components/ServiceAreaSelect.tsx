import { useQuery } from '@tanstack/react-query';

import { getAdminServiceAreas } from '../api/service-area.api';
import { LOCATION_STATUS } from '../constants/store.constants';

type ServiceAreaSelectProps = {
  cityId?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  value?: string | null;
  onChange: (nextId: string | undefined) => void;
};

export function ServiceAreaSelect({
  cityId,
  disabled = false,
  error,
  id = 'service-area-select',
  label = 'Service area',
  value,
  onChange,
}: ServiceAreaSelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-service-area-options', cityId],
    queryFn: () =>
      getAdminServiceAreas({
        cityId,
        limit: 500,
        status: LOCATION_STATUS.ACTIVE,
        isServiceable: true,
        sortBy: 'name',
        sortOrder: 'asc',
      }),
    enabled: Boolean(cityId),
  });

  const items = data?.items ?? [];
  const errorId = error ? `${id}-error` : undefined;
  const placeholder = cityId ? 'Select service area' : 'Select a city first';

  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor={id}>{label}</label>
      <select
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        disabled={disabled || isLoading || !cityId}
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
        <option value="">{placeholder}</option>
        {items.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
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
