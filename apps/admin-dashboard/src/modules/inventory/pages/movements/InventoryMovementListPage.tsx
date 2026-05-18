import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Table, type TableColumn } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CatalogPagination } from '../../../catalog/components/CatalogPagination';
import { InventoryMovementBadge } from '../../components/InventoryMovementBadge';
import { InventoryEmptyState } from '../../components/InventoryEmptyState';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { InventoryTableSkeleton } from '../../components/InventoryTableSkeleton';
import { MOVEMENT_TYPE, MOVEMENT_TYPE_LABELS } from '../../constants/inventory.constants';
import { useInventoryMovements } from '../../hooks/useInventoryMovements';
import type { InventoryMovementResponse } from '../../types/inventory-movement.types';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';
import { setSearchParams } from '../../utils/inventory-query-param.util';

type MovementRow = InventoryMovementResponse & Record<string, unknown>;

export function InventoryMovementListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useInventoryMovements();

  const rows = useMemo(
    () => (data?.items ?? []).map((item) => ({ ...item } as MovementRow)),
    [data?.items],
  );

  const columns: TableColumn<MovementRow>[] = [
    {
      header: 'Type',
      key: 'movementType',
      render: (row) => <InventoryMovementBadge movementType={row.movementType} />,
    },
    { header: 'Quantity', key: 'quantity' },
    { header: 'Stock', key: 'inventoryStockId' },
    { header: 'Reference', key: 'referenceType' },
    {
      header: 'Created',
      key: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => <Link to={`/inventory/movements/${row.id}`}>View</Link>,
    },
  ];

  if (error) {
    return (
      <>
        <CatalogPageHeader
          description="Audit trail of stock quantity changes."
          title="Inventory movements"
        />
        <InventoryErrorState
          message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load movements.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader description="Audit trail of stock quantity changes." title="Inventory movements" />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <MovementFilters
          fromDate={searchParams.get('fromDate') ?? ''}
          movementType={searchParams.get('movementType') ?? ''}
          toDate={searchParams.get('toDate') ?? ''}
          onFromDateChange={(value) => {
            const params = new URLSearchParams(searchParams);
            setSearchParams(params, { fromDate: value || null, page: 1 });
            setUrlSearchParams(params, { replace: true });
          }}
          onMovementTypeChange={(value) => {
            const params = new URLSearchParams(searchParams);
            setSearchParams(params, { movementType: value || null, page: 1 });
            setUrlSearchParams(params, { replace: true });
          }}
          onToDateChange={(value) => {
            const params = new URLSearchParams(searchParams);
            setSearchParams(params, { page: 1, toDate: value || null });
            setUrlSearchParams(params, { replace: true });
          }}
        />
        {isLoading && !data ? <InventoryTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <InventoryEmptyState description="No movements match your filters." title="No movements" />
        ) : null}
        {rows.length > 0 ? (
          <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
    </>
  );
}

function MovementFilters({
  fromDate,
  movementType,
  toDate,
  onFromDateChange,
  onMovementTypeChange,
  onToDateChange,
}: {
  fromDate: string;
  movementType: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onMovementTypeChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}) {
  return (
    <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="movement-type-filter">Movement type</label>
        <select
          id="movement-type-filter"
          value={movementType}
          onChange={(event) => onMovementTypeChange(event.target.value)}
          style={{ borderRadius: 'var(--radius-md)', minWidth: 200, padding: 'var(--spacing-md)' }}
        >
          <option value="">All types</option>
          {Object.values(MOVEMENT_TYPE).map((type) => (
            <option key={type} value={type}>
              {MOVEMENT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="from-date">From date</label>
        <input
          id="from-date"
          type="date"
          value={fromDate}
          onChange={(event) => onFromDateChange(event.target.value)}
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}
        />
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="to-date">To date</label>
        <input
          id="to-date"
          type="date"
          value={toDate}
          onChange={(event) => onToDateChange(event.target.value)}
          style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}
        />
      </div>
    </div>
  );
}
