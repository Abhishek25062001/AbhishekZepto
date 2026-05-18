import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Table, type TableColumn } from '../../../components/common';
import { VendorCatalogPagination } from '../../store-catalog/components/VendorCatalogPagination';
import { VendorInventoryMovementBadge } from '../components/VendorInventoryMovementBadge';
import { VendorInventoryEmptyState } from '../components/VendorInventoryEmptyState';
import { VendorInventoryErrorState } from '../components/VendorInventoryErrorState';
import { VendorInventoryTableSkeleton } from '../components/VendorInventoryTableSkeleton';
import {
  REFERENCE_TYPE_LABELS,
  VENDOR_MOVEMENT_TYPE,
  VENDOR_MOVEMENT_TYPE_LABELS,
} from '../constants/vendor-inventory.constants';
import { useVendorInventoryMovements } from '../hooks/useVendorInventoryMovements';
import type { VendorInventoryMovement } from '../types/vendor-inventory.types';
import {
  extractApiErrorCode,
  mapInventoryErrorCodeToMessage,
} from '../utils/vendor-inventory-error-message.util';
import { setSearchParams } from '../utils/vendor-inventory-query-param.util';

type Row = VendorInventoryMovement & Record<string, unknown>;

export function VendorInventoryMovementListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useVendorInventoryMovements();
  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as Row)), [data?.items]);

  const columns: TableColumn<Row>[] = [
    {
      header: 'Type',
      key: 'movementType',
      render: (row) => <VendorInventoryMovementBadge movementType={row.movementType} />,
    },
    { header: 'Qty', key: 'quantity' },
    { header: 'Stock', key: 'inventoryStockId' },
    { header: 'SKU ref', key: 'storeProductId' },
    {
      header: 'Reference',
      key: 'referenceType',
      render: (row) => REFERENCE_TYPE_LABELS[row.referenceType],
    },
    { header: 'When', key: 'createdAt' },
  ];

  if (error) {
    return (
      <VendorInventoryErrorState
        message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load movements.')}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
      <header>
        <Link to="/inventory/stocks">← Stock list</Link>
        <h1>Inventory movements</h1>
      </header>
      <label style={{ display: 'grid', gap: '6px', maxWidth: 240 }}>
        Movement type
        <select
          value={searchParams.get('movementType') ?? ''}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams);
            setSearchParams(params, { page: 1, movementType: event.target.value || null });
            setUrlSearchParams(params, { replace: true });
          }}
          style={{ padding: 'var(--spacing-sm)' }}
        >
          <option value="">All</option>
          {Object.values(VENDOR_MOVEMENT_TYPE).map((type) => (
            <option key={type} value={type}>
              {VENDOR_MOVEMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </label>
      {isLoading && !data ? <VendorInventoryTableSkeleton /> : null}
      {!isLoading && rows.length === 0 ? <VendorInventoryEmptyState title="No movements" /> : null}
      {rows.length > 0 ? (
        <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
      ) : null}
      <VendorCatalogPagination pagination={data?.pagination} />
    </section>
  );
}
