import { useSearchParams } from 'react-router-dom';

import type { VendorOrderPaymentStatus, VendorOrderStatus, VendorOrderStoreStatus } from '../types/vendor-orders.types';

type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

const orderStatusOptions: Array<FilterOption<VendorOrderStatus>> = [
  { label: 'Placed', value: 'placed' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Picking', value: 'picking' },
  { label: 'Packing', value: 'packing' },
  { label: 'Ready for pickup', value: 'ready_for_pickup' },
  { label: 'Cancelled', value: 'cancelled' },
];

const storeStatusOptions: Array<FilterOption<VendorOrderStoreStatus>> = [
  { label: 'Pending acceptance', value: 'pending_acceptance' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
];

const paymentStatusOptions: Array<FilterOption<VendorOrderPaymentStatus>> = [
  { label: 'Paid', value: 'paid' },
];

const setFilterParam = (
  params: URLSearchParams,
  key: string,
  value: string,
) => {
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  params.delete('page');
};

export function VendorOrderHistoryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    setFilterParam(next, key, value);
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('status');
    next.delete('storeStatus');
    next.delete('paymentStatus');
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <section style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
      <label>
        Order status
        <select
          onChange={(event) => updateFilter('status', event.target.value)}
          style={{ display: 'block', marginTop: 'var(--spacing-xs)', padding: 'var(--spacing-sm)' }}
          value={searchParams.get('status') ?? ''}
        >
          <option value="">All</option>
          {orderStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label>
        Store status
        <select
          onChange={(event) => updateFilter('storeStatus', event.target.value)}
          style={{ display: 'block', marginTop: 'var(--spacing-xs)', padding: 'var(--spacing-sm)' }}
          value={searchParams.get('storeStatus') ?? ''}
        >
          <option value="">All</option>
          {storeStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <label>
        Payment
        <select
          onChange={(event) => updateFilter('paymentStatus', event.target.value)}
          style={{ display: 'block', marginTop: 'var(--spacing-xs)', padding: 'var(--spacing-sm)' }}
          value={searchParams.get('paymentStatus') ?? ''}
        >
          <option value="">All</option>
          {paymentStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
      <button onClick={clearFilters} style={{ alignSelf: 'end' }} type="button">
        Clear filters
      </button>
    </section>
  );
}
