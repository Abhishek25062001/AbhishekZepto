import { useSearchParams } from 'react-router-dom';

import { Button, Input } from '../../../components/common';
import {
  ADMIN_ORDER_PAYMENT_STATUS_LABELS,
  ADMIN_ORDER_PAYMENT_STATUSES,
  ADMIN_ORDER_STATUS_LABELS,
  ADMIN_ORDER_STATUSES,
  ADMIN_ORDER_STORE_STATUS_LABELS,
  ADMIN_ORDER_STORE_STATUSES,
} from '../utils/admin-orders-display.util';
import { setAdminOrderSearchParams } from '../utils/admin-orders-query.util';

export function AdminOrderFilters() {
  const [searchParams, setUrlSearchParams] = useSearchParams();

  const updateFilters = (updates: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(searchParams);
    setAdminOrderSearchParams(params, { page: 1, ...updates });
    setUrlSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setUrlSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <section
      style={{
        alignItems: 'flex-end',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)',
      }}
    >
      <FilterSelect
        label="Status"
        options={[
          { label: 'All statuses', value: '' },
          ...ADMIN_ORDER_STATUSES.map((status) => ({
            label: ADMIN_ORDER_STATUS_LABELS[status],
            value: status,
          })),
        ]}
        value={searchParams.get('status') ?? ''}
        onChange={(value) => updateFilters({ status: value || null })}
      />
      <FilterSelect
        label="Store status"
        options={[
          { label: 'All store statuses', value: '' },
          ...ADMIN_ORDER_STORE_STATUSES.map((status) => ({
            label: ADMIN_ORDER_STORE_STATUS_LABELS[status],
            value: status,
          })),
        ]}
        value={searchParams.get('storeStatus') ?? ''}
        onChange={(value) => updateFilters({ storeStatus: value || null })}
      />
      <FilterSelect
        label="Payment"
        options={[
          { label: 'All payments', value: '' },
          ...ADMIN_ORDER_PAYMENT_STATUSES.map((status) => ({
            label: ADMIN_ORDER_PAYMENT_STATUS_LABELS[status],
            value: status,
          })),
        ]}
        value={searchParams.get('paymentStatus') ?? ''}
        onChange={(value) => updateFilters({ paymentStatus: value || null })}
      />
      <Input
        label="Store ID"
        value={searchParams.get('storeId') ?? ''}
        onChange={(event) => updateFilters({ storeId: event.target.value || null })}
      />
      <Input
        label="City ID"
        value={searchParams.get('cityId') ?? ''}
        onChange={(event) => updateFilters({ cityId: event.target.value || null })}
      />
      <Input
        label="Customer ID"
        value={searchParams.get('customerId') ?? ''}
        onChange={(event) => updateFilters({ customerId: event.target.value || null })}
      />
      <Input
        label="From"
        type="date"
        value={searchParams.get('fromDate') ?? ''}
        onChange={(event) => updateFilters({ fromDate: event.target.value || null })}
      />
      <Input
        label="To"
        type="date"
        value={searchParams.get('toDate') ?? ''}
        onChange={(event) => updateFilters({ toDate: event.target.value || null })}
      />
      <FilterSelect
        label="Sort"
        options={[
          { label: 'Newest first', value: 'createdAt_desc' },
          { label: 'Oldest first', value: 'createdAt_asc' },
          { label: 'Status A-Z', value: 'status_asc' },
          { label: 'Status Z-A', value: 'status_desc' },
          { label: 'SLA priority', value: 'sla_priority' },
        ]}
        value={searchParams.get('sort') ?? 'createdAt_desc'}
        onChange={(value) => updateFilters({ sort: value })}
      />
      <Button type="button" variant="outline" onClick={clearFilters}>
        Clear
      </Button>
    </section>
  );
}

type FilterSelectProps = {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
};

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
  return (
    <label style={{ display: 'grid', gap: '6px' }}>
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-primary)',
          minHeight: 44,
          padding: 'var(--spacing-sm) var(--spacing-md)',
        }}
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
