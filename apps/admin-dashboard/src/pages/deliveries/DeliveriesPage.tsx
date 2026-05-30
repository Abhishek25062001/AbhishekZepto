import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge, EmptyState, Loader, Table, type TableColumn } from '../../components/common';
import { useAdminDeliveries } from '../../hooks/useAdminDeliveries';
import { useAdminRealtimeStore } from '../../modules/realtime-control-tower/store/admin-realtime.store';
import { applyAdminRealtimeDeliveryEventToOperationsList } from '../../modules/realtime-control-tower/utils/admin-delivery-operations-realtime.util';
import type { AdminDeliveryListQuery, DeliveryStatus } from '../../services/api/delivery.api';

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------

function getStatusVariant(status: DeliveryStatus): 'warning' | 'info' | 'success' | 'error' | 'neutral' {
  if (status === 'pending_assignment') return 'warning';
  if (['assigned', 'en_route_to_store', 'arrived_at_store', 'picked_up'].includes(status)) return 'info';
  if (['en_route_to_customer', 'arrived_at_customer'].includes(status)) return 'neutral';
  if (status === 'delivered') return 'success';
  if (status === 'failed' || status === 'cancelled') return 'error';
  return 'neutral';
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Table columns
// ---------------------------------------------------------------------------

const columns: TableColumn<Record<string, unknown>>[] = [
  { header: 'Delivery ID', key: 'deliveryId', render: (row) => <code style={{ fontSize: 12 }}>{String(row['deliveryId']).slice(-8)}</code> },
  { header: 'Order ID', key: 'orderId', render: (row) => <code style={{ fontSize: 12 }}>{String(row['orderId']).slice(-8)}</code> },
  {
    header: 'Status',
    key: 'deliveryStatus',
    render: (row) => (
      <Badge variant={getStatusVariant(row['deliveryStatus'] as DeliveryStatus)}>
        {formatStatus(String(row['deliveryStatus']))}
      </Badge>
    ),
  },
  {
    header: 'Agent ID',
    key: 'deliveryAgentId',
    render: (row) =>
      row['deliveryAgentId']
        ? <code style={{ fontSize: 12 }}>{String(row['deliveryAgentId']).slice(-8)}</code>
        : <span style={{ color: 'var(--color-text-secondary)' }}>Unassigned</span>,
  },
  { header: 'Assigned At', key: 'assignedAt', render: (row) => row['assignedAt'] ? new Date(String(row['assignedAt'])).toLocaleString() : '—' },
  { header: 'Created At', key: 'createdAt', render: (row) => new Date(String(row['createdAt'])).toLocaleString() },
  {
    header: 'Actions',
    key: 'deliveryId',
    render: (row) => (
      <Link
        id={`view-delivery-${String(row['deliveryId'])}`}
        style={{
          color: 'var(--color-primary)',
          fontWeight: 600,
          textDecoration: 'none',
        }}
        to={`/deliveries/${String(row['deliveryId'])}`}
      >
        View Details
      </Link>
    ),
  },
];

// ---------------------------------------------------------------------------
// Status options for filter dropdown
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: { label: string; value: DeliveryStatus }[] = [
  { label: 'Pending Assignment', value: 'pending_assignment' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'En Route to Store', value: 'en_route_to_store' },
  { label: 'Arrived at Store', value: 'arrived_at_store' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'En Route to Customer', value: 'en_route_to_customer' },
  { label: 'Arrived at Customer', value: 'arrived_at_customer' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function DeliveriesPage() {
  const [filters, setFilters] = useState<AdminDeliveryListQuery>({ page: 1, limit: 20 });

  const { data, isLoading, error, refetch } = useAdminDeliveries(filters);
  const lastDeliveryEvent = useAdminRealtimeStore((state) => state.lastDeliveryEvent);

  const liveDeliveries = applyAdminRealtimeDeliveryEventToOperationsList(
    data?.items ?? [],
    lastDeliveryEvent,
    filters,
  );
  const rows: Record<string, unknown>[] = liveDeliveries as unknown as Record<string, unknown>[];
  const pagination = data?.pagination;

  return (
    <div id="deliveries-page" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Page header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Deliveries</h1>
        <button
          id="deliveries-refresh"
          onClick={() => void refetch()}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: 14,
            padding: 'var(--spacing-sm) var(--spacing-md)',
          }}
          type="button"
        >
          ↻ Refresh
        </button>
      </header>

      {/* Filter bar */}
      <div
        id="deliveries-filter-bar"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
          padding: 'var(--spacing-lg)',
        }}
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Status</span>
          <select
            id="filter-status"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                status: e.target.value ? (e.target.value as DeliveryStatus) : undefined,
                page: 1,
              }))
            }
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              fontSize: 14,
              padding: 'var(--spacing-sm)',
            }}
            value={filters.status ?? ''}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Agent ID</span>
          <input
            id="filter-agent-id"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, agentId: e.target.value || undefined, page: 1 }))
            }
            placeholder="Filter by agent ID"
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              fontSize: 14,
              padding: 'var(--spacing-sm)',
            }}
            type="text"
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Store ID</span>
          <input
            id="filter-store-id"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, storeId: e.target.value || undefined, page: 1 }))
            }
            placeholder="Filter by store ID"
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              fontSize: 14,
              padding: 'var(--spacing-sm)',
            }}
            type="text"
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 200 }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>City ID</span>
          <input
            id="filter-city-id"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, cityId: e.target.value || undefined, page: 1 }))
            }
            placeholder="Filter by city ID"
            style={{
              background: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              fontSize: 14,
              padding: 'var(--spacing-sm)',
            }}
            type="text"
          />
        </label>
      </div>

      {/* Table area */}
      {isLoading ? (
        <Loader label="Loading deliveries…" />
      ) : error ? (
        <p style={{ color: 'var(--color-error)' }}>Failed to load deliveries. Please try again.</p>
      ) : rows.length === 0 ? (
        <EmptyState
          description="No delivery assignments match the current filters."
          title="No deliveries found"
        />
      ) : (
        <Table
          columns={columns}
          data={rows}
          emptyMessage="No deliveries found."
          rowKey="deliveryId"
        />
      )}

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit ? (
        <div
          id="deliveries-pagination"
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: 'var(--spacing-md)',
            justifyContent: 'flex-end',
          }}
        >
          <button
            disabled={pagination.page <= 1}
            id="pagination-prev"
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
              opacity: pagination.page <= 1 ? 0.4 : 1,
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}
            type="button"
          >
            ← Prev
          </button>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>
            Page {pagination.page} · {pagination.total} total
          </span>
          <button
            disabled={pagination.page * pagination.limit >= pagination.total}
            id="pagination-next"
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              cursor: pagination.page * pagination.limit >= pagination.total ? 'not-allowed' : 'pointer',
              opacity: pagination.page * pagination.limit >= pagination.total ? 0.4 : 1,
              padding: 'var(--spacing-sm) var(--spacing-md)',
            }}
            type="button"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}
