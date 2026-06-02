import { Button } from '../../../components/common/Button';
import type { OperationalAnalyticsFilters } from '../types/operational-overview.types';

type AnalyticsFilterBarProps = {
  filters: OperationalAnalyticsFilters;
  onChange: (filters: OperationalAnalyticsFilters) => void;
  onReset: () => void;
};

const inputStyle = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  minHeight: 40,
  padding: '0 var(--spacing-sm)',
};

export function AnalyticsFilterBar({ filters, onChange, onReset }: AnalyticsFilterBarProps) {
  const update = (key: keyof OperationalAnalyticsFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{
        alignItems: 'end',
        display: 'grid',
        gap: 'var(--spacing-md)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      }}
    >
      <label>
        From
        <input
          style={inputStyle}
          type="date"
          value={filters.fromDate ?? ''}
          onChange={(event) => update('fromDate', event.target.value)}
        />
      </label>
      <label>
        To
        <input
          style={inputStyle}
          type="date"
          value={filters.toDate ?? ''}
          onChange={(event) => update('toDate', event.target.value)}
        />
      </label>
      <label>
        Timezone
        <input
          style={inputStyle}
          type="text"
          value={filters.timezone ?? 'UTC'}
          onChange={(event) => update('timezone', event.target.value)}
        />
      </label>
      <label>
        Store ID
        <input
          style={inputStyle}
          type="text"
          value={filters.storeId ?? ''}
          onChange={(event) => update('storeId', event.target.value)}
        />
      </label>
      <label>
        Vendor ID
        <input
          style={inputStyle}
          type="text"
          value={filters.vendorId ?? ''}
          onChange={(event) => update('vendorId', event.target.value)}
        />
      </label>
      <label>
        City ID
        <input
          style={inputStyle}
          type="text"
          value={filters.cityId ?? ''}
          onChange={(event) => update('cityId', event.target.value)}
        />
      </label>
      <Button onClick={onReset} variant="outline">
        Reset
      </Button>
    </form>
  );
}
