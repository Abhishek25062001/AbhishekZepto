import { useQuery } from '@tanstack/react-query';
import { getAdminInventoryStocks } from '../api/inventory-stock.api';
import { INVENTORY_STOCK_STATUS } from '../constants/inventory.constants';

type Props = {
  storeId?: string;
  value?: string | null;
  onChange: (id: string | undefined) => void;
};

export function InventoryStockSelect({ storeId, value, onChange }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-inventory-stock-options', storeId],
    queryFn: () => getAdminInventoryStocks({ storeId, limit: 500, status: INVENTORY_STOCK_STATUS.ACTIVE }),
    enabled: Boolean(storeId),
  });
  const items = data?.items ?? [];
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor="inventory-stock-select">Stock record</label>
      <select
        id="inventory-stock-select"
        disabled={isLoading || !storeId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}
      >
        <option value="">{storeId ? 'Select stock' : 'Select store first'}</option>
        {items.map((s) => (
          <option key={s.id} value={s.id}>{s.sku} (avail: {s.availableQuantity})</option>
        ))}
      </select>
    </div>
  );
}
