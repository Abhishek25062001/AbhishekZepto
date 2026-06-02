import { Link } from 'react-router-dom';

import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminStoreSummary } from '../types/admin-vendor-store.types';
import {
  formatVendorStoreDate,
  formatVendorStoreLabel,
  getBooleanStatusVariant,
  getVendorStoreStatusVariant,
} from '../utils/admin-vendor-store-display.util';

type StoreRow = AdminStoreSummary & Record<string, unknown>;

const columns: TableColumn<StoreRow>[] = [
  {
    header: 'Store',
    key: 'storeId',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.name}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.code} · {row.slug}</span>
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
    header: 'Open',
    key: 'isOpen',
    render: row => (
      <Badge variant={getBooleanStatusVariant(row.isOpen)}>{row.isOpen ? 'Open' : 'Closed'}</Badge>
    ),
  },
  {
    header: 'Accepting',
    key: 'isAcceptingOrders',
    render: row => (
      <Badge variant={getBooleanStatusVariant(row.isAcceptingOrders)}>
        {row.isAcceptingOrders ? 'Accepting' : 'Paused'}
      </Badge>
    ),
  },
  {
    header: 'Vendor',
    key: 'vendorId',
  },
  {
    header: 'City',
    key: 'cityId',
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatVendorStoreDate(row.updatedAt),
  },
  {
    header: 'Actions',
    key: 'code',
    render: row => <Link to={`/stores/${row.storeId}`}>View</Link>,
  },
];

export function StoresTable({
  loading,
  stores,
}: {
  loading?: boolean;
  stores: AdminStoreSummary[];
}) {
  return (
    <Table
      columns={columns}
      data={stores as StoreRow[]}
      emptyMessage="No stores found."
      loading={loading}
      rowKey="storeId"
    />
  );
}
