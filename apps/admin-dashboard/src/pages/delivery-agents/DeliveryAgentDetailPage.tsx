import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import { CanAccessAny } from '../../components/auth/CanAccessAny';
import { Button, EmptyState, ErrorView, Loader } from '../../components/common';
import { DeliveryAgentAuditTable } from '../../modules/delivery-agents/components/DeliveryAgentAuditTable';
import { DeliveryAgentAssignmentsFilterBar } from '../../modules/delivery-agents/components/DeliveryAgentAssignmentsFilterBar';
import { DeliveryAgentAssignmentsTable } from '../../modules/delivery-agents/components/DeliveryAgentAssignmentsTable';
import { DeliveryAgentStatusControl } from '../../modules/delivery-agents/components/DeliveryAgentStatusControl';
import { DeliveryAgentSummary } from '../../modules/delivery-agents/components/DeliveryAgentSummary';
import { DeliveryAgentVerificationControl } from '../../modules/delivery-agents/components/DeliveryAgentVerificationControl';
import { useAdminDeliveryAgentAudit } from '../../modules/delivery-agents/hooks/useAdminDeliveryAgentAudit';
import { useAdminDeliveryAgentAssignments } from '../../modules/delivery-agents/hooks/useAdminDeliveryAgentAssignments';
import { useAdminDeliveryAgentDetail } from '../../modules/delivery-agents/hooks/useAdminDeliveryAgentDetail';
import type {
  AdminDeliveryAgentAssignmentsQuery,
  AdminDeliveryAgentAuditQuery,
} from '../../modules/delivery-agents/types/admin-delivery-agents.types';
import { getApiErrorMessage } from '../../utils/error-message.util';

const DELIVERY_AGENT_STATUS_PERMISSIONS = ['delivery:update-status', 'settings:manage'] as const;
const DELIVERY_AGENT_VERIFICATION_PERMISSIONS = ['delivery:update', 'settings:manage'] as const;

export function DeliveryAgentDetailPage() {
  const { deliveryAgentId } = useParams<{ deliveryAgentId: string }>();
  const [statusOpen, setStatusOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [assignmentFilters, setAssignmentFilters] = useState<AdminDeliveryAgentAssignmentsQuery>({
    page: 1,
    limit: 20,
  });
  const [auditFilters, setAuditFilters] = useState<AdminDeliveryAgentAuditQuery>({
    page: 1,
    limit: 20,
  });

  if (!deliveryAgentId) {
    return <Navigate replace to="/delivery-agents" />;
  }

  const detailQuery = useAdminDeliveryAgentDetail(deliveryAgentId);
  const assignmentsQuery = useAdminDeliveryAgentAssignments(deliveryAgentId, assignmentFilters);
  const auditQuery = useAdminDeliveryAgentAudit(deliveryAgentId, auditFilters);
  const assignments = assignmentsQuery.data?.items ?? [];
  const assignmentPagination = assignmentsQuery.data?.pagination;
  const audit = auditQuery.data?.items ?? [];
  const auditPagination = auditQuery.data?.pagination;

  if (detailQuery.isLoading) {
    return <Loader label="Loading delivery agent..." mode="page" />;
  }

  if (detailQuery.error) {
    return (
      <ErrorView
        message={getApiErrorMessage(detailQuery.error, 'Unable to load delivery agent.')}
        onRetry={() => void detailQuery.refetch()}
        title="Unable to load delivery agent"
      />
    );
  }

  if (!detailQuery.data) {
    return <Navigate replace to="/delivery-agents" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/delivery-agents">Back to delivery agents</Link>
          <h1 style={{ marginBottom: 0 }}>Delivery Agent Detail</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <CanAccessAny permissions={DELIVERY_AGENT_STATUS_PERMISSIONS}>
            <Button onClick={() => setStatusOpen(true)} type="button" variant="danger">
              Change Status
            </Button>
          </CanAccessAny>
          <CanAccessAny permissions={DELIVERY_AGENT_VERIFICATION_PERMISSIONS}>
            <Button onClick={() => setVerificationOpen(true)} type="button" variant="secondary">
              Change Verification
            </Button>
          </CanAccessAny>
          <Button onClick={() => {
            void detailQuery.refetch();
            void assignmentsQuery.refetch();
            void auditQuery.refetch();
          }} type="button" variant="outline">
            Refresh
          </Button>
        </div>
      </header>

      <DeliveryAgentSummary agent={detailQuery.data} />

      <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <h2 style={{ margin: 0 }}>Assignment History</h2>
        <DeliveryAgentAssignmentsFilterBar
          filters={assignmentFilters}
          onChange={setAssignmentFilters}
        />

        {assignmentsQuery.error ? (
          <ErrorView
            message={getApiErrorMessage(
              assignmentsQuery.error,
              'Unable to load delivery agent assignments.',
            )}
            onRetry={() => void assignmentsQuery.refetch()}
            title="Unable to load assignments"
          />
        ) : null}

        {!assignmentsQuery.error ? (
          <DeliveryAgentAssignmentsTable
            assignments={assignments}
            loading={assignmentsQuery.isLoading}
          />
        ) : null}

        {!assignmentsQuery.isLoading && !assignmentsQuery.error && assignments.length === 0 ? (
          <EmptyState
            description="No assignment records match the current filters."
            title="No assignment records found"
          />
        ) : null}

        {assignmentPagination ? (
          <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              Page {assignmentPagination.page} of {assignmentPagination.totalPages} ·{' '}
              {assignmentPagination.total} assignments
            </span>
            <Button
              disabled={!assignmentPagination.hasPreviousPage}
              onClick={() => setAssignmentFilters(previous => ({
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
              disabled={!assignmentPagination.hasNextPage}
              onClick={() => setAssignmentFilters(previous => ({
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
      </section>

      <section style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        <h2 style={{ margin: 0 }}>Audit History</h2>

        {auditQuery.error ? (
          <ErrorView
            message={getApiErrorMessage(auditQuery.error, 'Unable to load delivery agent audit.')}
            onRetry={() => void auditQuery.refetch()}
            title="Unable to load audit"
          />
        ) : null}

        {!auditQuery.error ? (
          <DeliveryAgentAuditTable audit={audit} loading={auditQuery.isLoading} />
        ) : null}

        {!auditQuery.isLoading && !auditQuery.error && audit.length === 0 ? (
          <EmptyState
            description="No audit records are available for this delivery agent."
            title="No audit records found"
          />
        ) : null}

        {auditPagination ? (
          <footer style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              Page {auditPagination.page} of {auditPagination.totalPages} · {auditPagination.total}{' '}
              audit records
            </span>
            <Button
              disabled={!auditPagination.hasPreviousPage}
              onClick={() => setAuditFilters(previous => ({
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
              disabled={!auditPagination.hasNextPage}
              onClick={() => setAuditFilters(previous => ({
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
      </section>

      <DeliveryAgentStatusControl
        agent={detailQuery.data}
        onClose={() => setStatusOpen(false)}
        open={statusOpen}
      />
      <DeliveryAgentVerificationControl
        agent={detailQuery.data}
        onClose={() => setVerificationOpen(false)}
        open={verificationOpen}
      />
    </div>
  );
}
