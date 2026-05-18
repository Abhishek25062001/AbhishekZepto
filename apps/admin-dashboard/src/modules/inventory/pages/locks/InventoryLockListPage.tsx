import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { CanAccess } from '../../../../components/auth/CanAccess';
import { Badge, Button, Table, type TableColumn } from '../../../../components/common';
import { CatalogPageHeader } from '../../../catalog/components/CatalogPageHeader';
import { CatalogPagination } from '../../../catalog/components/CatalogPagination';
import { LOCK_STATUS, LOCK_STATUS_LABELS, LOCK_TYPE, LOCK_TYPE_LABELS } from '../../constants/inventory.constants';
import { InventoryEmptyState } from '../../components/InventoryEmptyState';
import { InventoryErrorState } from '../../components/InventoryErrorState';
import { InventoryTableSkeleton } from '../../components/InventoryTableSkeleton';
import { useInventoryLockMutations } from '../../hooks/useInventoryLockMutations';
import { useInventoryLocks } from '../../hooks/useInventoryLocks';
import type { ExpireDueLocksSummary, InventoryLockResponse } from '../../types/inventory-lock.types';
import { extractApiErrorCode, mapInventoryErrorCodeToMessage } from '../../utils/inventory-error-message.util';
import { setSearchParams } from '../../utils/inventory-query-param.util';

type LockRow = InventoryLockResponse & Record<string, unknown>;

export function InventoryLockListPage() {
  const [searchParams, setUrlSearchParams] = useSearchParams();
  const { data, error, isLoading, refetch, isFetching } = useInventoryLocks();
  const { expireDueMutation } = useInventoryLockMutations();
  const [expireSummary, setExpireSummary] = useState<ExpireDueLocksSummary | null>(null);

  const rows = useMemo(() => (data?.items ?? []).map((item) => ({ ...item } as LockRow)), [data?.items]);

  const columns: TableColumn<LockRow>[] = [
    { header: 'Token', key: 'lockToken' },
    {
      header: 'Type',
      key: 'lockType',
      render: (row) => LOCK_TYPE_LABELS[row.lockType],
    },
    { header: 'Quantity', key: 'quantity' },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge variant="neutral">{LOCK_STATUS_LABELS[row.status]}</Badge>,
    },
    {
      header: 'Expires',
      key: 'expiresAt',
      render: (row) => new Date(row.expiresAt).toLocaleString(),
    },
    {
      header: 'Actions',
      key: 'id',
      render: (row) => <Link to={`/inventory/locks/${row.id}`}>View</Link>,
    },
  ];

  if (error) {
    return (
      <>
        <CatalogPageHeader description="Monitor active inventory reservations." title="Inventory locks" />
        <InventoryErrorState
          message={mapInventoryErrorCodeToMessage(extractApiErrorCode(error), 'Unable to load locks.')}
          onRetry={() => void refetch()}
        />
      </>
    );
  }

  return (
    <>
      <CatalogPageHeader description="Monitor active inventory reservations." title="Inventory locks" />
      <section style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <CanAccess permission="inventory:adjust">
            <Button
              loading={expireDueMutation.isPending}
              type="button"
              variant="outline"
              onClick={() => {
                void expireDueMutation.mutateAsync().then((summary) => setExpireSummary(summary));
              }}
            >
              Expire due locks
            </Button>
          </CanAccess>
          {expireSummary ? (
            <span>
              Processed {expireSummary.processed}, expired {expireSummary.expired}, failed {expireSummary.failed}
            </span>
          ) : null}
        </div>
        <div style={{ alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
          <div style={{ display: 'grid', gap: '6px' }}>
            <label htmlFor="lock-status-filter">Status</label>
            <select
              id="lock-status-filter"
              value={searchParams.get('status') ?? ''}
              onChange={(event) => {
                const params = new URLSearchParams(searchParams);
                setSearchParams(params, { page: 1, status: event.target.value || null });
                setUrlSearchParams(params, { replace: true });
              }}
              style={{ borderRadius: 'var(--radius-md)', minWidth: 200, padding: 'var(--spacing-md)' }}
            >
              <option value="">All statuses</option>
              {Object.values(LOCK_STATUS).map((status) => (
                <option key={status} value={status}>
                  {LOCK_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <LockTypeFilter
            value={searchParams.get('lockType') ?? ''}
            onChange={(value) => {
              const params = new URLSearchParams(searchParams);
              setSearchParams(params, { lockType: value || null, page: 1 });
              setUrlSearchParams(params, { replace: true });
            }}
          />
        </div>
        {isLoading && !data ? <InventoryTableSkeleton columns={columns.length} /> : null}
        {!isLoading && rows.length === 0 ? (
          <InventoryEmptyState description="No locks match your filters." title="No locks" />
        ) : null}
        {rows.length > 0 ? (
          <Table columns={columns} data={rows} loading={isFetching && Boolean(data)} rowKey="id" />
        ) : null}
        <CatalogPagination pagination={data?.pagination} />
      </section>
    </>
  );
}

function LockTypeFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label htmlFor="lock-type-filter">Lock type</label>
      <select
        id="lock-type-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ borderRadius: 'var(--radius-md)', minWidth: 200, padding: 'var(--spacing-md)' }}
      >
        <option value="">All types</option>
        {Object.values(LOCK_TYPE).map((type) => (
          <option key={type} value={type}>
            {LOCK_TYPE_LABELS[type]}
          </option>
        ))}
      </select>
    </div>
  );
}
