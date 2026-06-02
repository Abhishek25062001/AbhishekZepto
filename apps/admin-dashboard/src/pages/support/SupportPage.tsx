import { useState } from 'react';

import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { CreateSupportTicketModal } from '../../modules/support/components/CreateSupportTicketModal';
import { SupportTicketFilterBar } from '../../modules/support/components/SupportTicketFilterBar';
import { SupportTicketTable } from '../../modules/support/components/SupportTicketTable';
import { useSupportTickets } from '../../modules/support/hooks/useSupportTickets';
import type { SupportTicketListQuery } from '../../modules/support/types/support.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

const SUPPORT_TICKET_CREATE_PERMISSIONS = ['support:create', 'settings:manage'] as const;

export function SupportPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<SupportTicketListQuery>({ page: 1, limit: 20 });
  const { data, error, isLoading, refetch } = useSupportTickets(filters);
  const tickets = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0 }}>Support</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <CanAccessAny permissions={SUPPORT_TICKET_CREATE_PERMISSIONS}>
            <Button onClick={() => setCreateOpen(true)} type="button">
              Create Ticket
            </Button>
          </CanAccessAny>
          <Button onClick={() => void refetch()} type="button" variant="outline">
            Refresh
          </Button>
        </div>
      </header>

      <SupportTicketFilterBar filters={filters} onChange={setFilters} />

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load support tickets.')}
          onRetry={() => void refetch()}
          title="Unable to load support tickets"
        />
      ) : null}

      {isLoading ? <Loader label="Loading support tickets..." /> : null}

      {!error ? <SupportTicketTable loading={isLoading} tickets={tickets} /> : null}

      {!isLoading && !error && tickets.length === 0 ? (
        <EmptyState
          description="No support tickets match the current filters."
          title="No support tickets found"
        />
      ) : null}

      {pagination ? (
        <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} tickets
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

      <CreateSupportTicketModal onClose={() => setCreateOpen(false)} open={createOpen} />
    </div>
  );
}
