import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CanAccess } from '../../../components/auth/CanAccess';
import { Table, type TableColumn } from '../../../components/common';
import { VendorInventoryStatusBadge, VendorStockLevelBadge } from '../components/VendorInventoryStatusBadge';
import { VendorInventoryEmptyState } from '../components/VendorInventoryEmptyState';
import { VendorInventoryErrorState } from '../components/VendorInventoryErrorState';
import { VendorInventoryTableSkeleton } from '../components/VendorInventoryTableSkeleton';
import { VendorCatalogPagination } from '../../store-catalog/components/VendorCatalogPagination';
import { VendorCatalogSearchInput } from '../../store-catalog/components/VendorCatalogSearchInput';
import { useVendorInventoryStocks } from '../hooks/useVendorInventoryStocks';
import type { VendorInventoryStock } from '../types/vendor-inventory.types';
import {
  extractApiErrorCode,
  mapInventoryErrorCodeToMessage,
} from '../utils/vendor-inventory-error-message.util';

type Row = VendorInventoryStock & Record<string, unknown>;

export function VendorInventoryStockListPage() {
  const { data, error, isLoading, refetch, isFetching } = useVendorInventoryStocks();
  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as Row)), [data?.items]);

  const columns: TableColumn<Row>[] = [
    { header: 'SKU', key: 'sku' },
    { header: 'Available', key: 'availableQuantity' },
    { header: 'Reserved', key: 'reservedQuantity' },
    { header: 'Total', key: 'totalQuantity' },
    {
      header: 'Level',
      key: 'isLowStock',
      render: (row) => <VendorStockLevelBadge isLowStock={row.isLowStock} isOutOfStock={row.isOutOfStock} />,
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <VendorInventoryStatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => (
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Link to={`/inventory/stocks/${row.id}`}>View</Link>
          <CanAccess permission="inventory:update">
            <Link to={`/inventory/stocks/${row.id}/adjust`}>Adjust</Link>
          </CanAccess>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <VendorInventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load stock.')}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <h1>Inventory stock</h1>
        <Link to="/inventory/movements">View movements</Link>
      </header>
      <VendorCatalogSearchInput placeholder="Search stock" />
      {isLoading && !data ? <VendorInventoryTableSkeleton /> : null}
      {!isLoading && rows.length === 0 ? <VendorInventoryEmptyState /> : null}
      {rows.length > 0 ? (
        <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
      ) : null}
      <VendorCatalogPagination pagination={data?.pagination} />
    </section>
  );
}
