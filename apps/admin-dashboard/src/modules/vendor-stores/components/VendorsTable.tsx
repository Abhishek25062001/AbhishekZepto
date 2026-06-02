import { Link } from 'react-router-dom';

import { Badge, Table, type TableColumn } from '../../../components/common';
import type { AdminVendorSummary } from '../types/admin-vendor-store.types';
import {
  formatVendorStoreDate,
  formatVendorStoreLabel,
  getVendorStoreStatusVariant,
} from '../utils/admin-vendor-store-display.util';

type VendorRow = AdminVendorSummary & Record<string, unknown>;

const columns: TableColumn<VendorRow>[] = [
  {
    header: 'Vendor',
    key: 'vendorId',
    render: row => (
      <div style={{ display: 'grid', gap: 2 }}>
        <strong>{row.name ?? 'Unnamed vendor'}</strong>
        <span style={{ color: 'var(--color-text-secondary)' }}>{row.email ?? row.phone ?? '—'}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'accountStatus',
    render: row => (
      <Badge variant={getVendorStoreStatusVariant(row.accountStatus)}>
        {row.accountStatus ? formatVendorStoreLabel(row.accountStatus) : '—'}
      </Badge>
    ),
  },
  {
    header: 'City',
    key: 'cityId',
    render: row => row.cityId ?? '—',
  },
  {
    header: 'Users',
    key: 'userCount',
  },
  {
    header: 'Stores',
    key: 'storeCount',
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: row => formatVendorStoreDate(row.updatedAt),
  },
  {
    header: 'Actions',
    key: 'primaryVendorUserId',
    render: row => <Link to={`/vendors/${row.vendorId}`}>View</Link>,
  },
];

export function VendorsTable({
  loading,
  vendors,
}: {
  loading?: boolean;
  vendors: AdminVendorSummary[];
}) {
  return (
    <Table
      columns={columns}
      data={vendors as VendorRow[]}
      emptyMessage="No vendors found."
      loading={loading}
      rowKey="vendorId"
    />
  );
}
