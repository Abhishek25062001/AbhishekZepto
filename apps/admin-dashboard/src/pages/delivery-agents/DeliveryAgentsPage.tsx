import { useState } from 'react';

import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { DeliveryAgentsFilterBar } from '../../modules/delivery-agents/components/DeliveryAgentsFilterBar';
import { DeliveryAgentsTable } from '../../modules/delivery-agents/components/DeliveryAgentsTable';
import { useAdminDeliveryAgents } from '../../modules/delivery-agents/hooks/useAdminDeliveryAgents';
import type { AdminDeliveryAgentListQuery } from '../../modules/delivery-agents/types/admin-delivery-agents.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

export function DeliveryAgentsPage() {
  const [filters, setFilters] = useState<AdminDeliveryAgentListQuery>({ page: 1, limit: 20 });
  const { data, error, isLoading, refetch } = useAdminDeliveryAgents(filters);
  const agents = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Delivery Agents</h1>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      <DeliveryAgentsFilterBar filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load delivery agents.')}
          onRetry={() => void refetch()}
          title="Unable to load delivery agents"
        />
      ) : null}

      {isLoading ? <Loader label="Loading delivery agents..." /> : null}

      {!error ? <DeliveryAgentsTable agents={agents} loading={isLoading} /> : null}

      {!isLoading && !error && agents.length === 0 ? (
        <EmptyState
          description="No delivery agents match the current filters."
          title="No delivery agents found"
        />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} agents
          </span>
          <Button
            disabled={!pagination.hasPreviousPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: Math.max(1, (previous.page ?? 1) - 1),
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters(previous => ({
              ...previous,
              page: (previous.page ?? 1) + 1,
            }))}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
          </Button>
        </footer>
      ) : null}
    </div>
  );
}
