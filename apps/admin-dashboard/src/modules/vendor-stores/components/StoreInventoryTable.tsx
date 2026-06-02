import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminStoreInventorySummary } from '../types/admin-vendor-store.types';
import {
  formatVendorStoreDate,
  formatVendorStoreLabel,
  getVendorStoreStatusVariant,
} from '../utils/admin-vendor-store-display.util';

type StoreInventoryRow = AdminStoreInventorySummary & Record<string, unknown>;

const columns: TableColumn<StoreInventoryRow>[] = [
  {
    header: 'SKU',
    key: 'sku',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.storeSku ?? row.sku}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.inventoryStockId}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: row => (
      <Badge variant={getVendorStoreStatusVariant(row.status)}>
        {formatVendorStoreLabel(row.status)}
      </Badge>
    ),
  },
  {
    header: 'Available',
    key: 'availableQuantity',
  },
  {
    header: 'Reserved',
    key: 'reservedQuantity',
  },
  {
    header: 'Damaged',
    key: 'damagedQuantity',
  },
  {
    header: 'Expired',
    key: 'expiredQuantity',
  },
  {
    header: 'Total',
    key: 'totalQuantity',
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatVendorStoreDate(row.updatedAt),
  },
];

export function StoreInventoryTable({
  inventory,
  loading,
}: {
  inventory: AdminStoreInventorySummary[];
  loading?: boolean;
}) {
  return (
    <Table
      columns={columns}
      data={inventory as StoreInventoryRow[]}
      emptyMessage="No inventory records found."
      loading={loading}
      rowKey="inventoryStockId"
    />
  );
}
