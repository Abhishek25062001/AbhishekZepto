import { useQuery } from '@tanstack/react-query';
import { getAdminStoreProducts } from '../api/store-product.api';
import { STORE_PRODUCT_STATUS } from '../constants/store-product.constants';

type Props = {
  storeId?: string;
  error?: string;
  value?: string | null;
  onChange: (id: string | undefined) => void;
};

export function StoreProductSelect({ storeId, error, value, onChange }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-store-product-options', storeId],
    queryFn: () => getAdminStoreProducts({ storeId, limit: 500, status: STORE_PRODUCT_STATUS.ACTIVE }),
    enabled: Boolean(storeId),
  });
  const items = data?.items ?? [];
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor="store-product-select">Store product</label>
      <select
        id="store-product-select"
        disabled={isLoading || !storeId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}
      >
        <option value="">{storeId ? 'Select mapping' : 'Select store first'}</option>
        {items.map((sp) => (
          <option key={sp.id} value={sp.id}>{sp.sku} — {sp.finalPrice}</option>
        ))}
      </select>
      {error ? <span style={{ color: 'var(--color-error)' }}>{error}</span> : null}
    </div>
  );
}
