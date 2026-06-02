import { Link, useParams } from 'react-router-dom';

import { CanAccessAny } from '../../../components/auth/CanAccessAny';
import { Button, ErrorView, Loader } from '../../../components/common';
import { useSupportTicketDetail } from '../hooks/useSupportTicketDetail';
import { SupportTicketSummary } from '../components/SupportTicketSummary';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { SupportTicketAssignmentControl } from '../components/SupportTicketAssignmentControl';
import { SupportTicketAuditTable } from '../components/SupportTicketAuditTable';
import { SupportTicketNotesPanel } from '../components/SupportTicketNotesPanel';
import { SupportTicketPriorityControl } from '../components/SupportTicketPriorityControl';
import { SupportTicketStatusControl } from '../components/SupportTicketStatusControl';

const SUPPORT_TICKET_UPDATE_PERMISSIONS = ['support:update', 'settings:manage'] as const;
const SUPPORT_TICKET_ASSIGN_PERMISSIONS = ['support:assign', 'settings:manage'] as const;

export function SupportTicketDetailPage() {
  const { ticketId = '' } = useParams<{ ticketId: string }>();
  const { data: ticket, error, isLoading, refetch } = useSupportTicketDetail(ticketId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      <header style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/support">Back to support</Link>
          <h1 style={{ margin: 0 }}>Support Ticket</h1>
        </div>
        <Button onClick={() => void refetch()} type="button" variant="outline">
          Refresh
        </Button>
      </header>

      {error ? (
        <ErrorView
          message={getApiErrorMessage(error, 'Unable to load support ticket.')}
          onRetry={() => void refetch()}
          title="Unable to load support ticket"
        />
      ) : null}

      {isLoading ? <Loader label="Loading support ticket..." /> : null}

      {!isLoading && !error && ticket ? (
        <>
          <SupportTicketSummary ticket={ticket} />
          <CanAccessAny permissions={SUPPORT_TICKET_UPDATE_PERMISSIONS}>
            <div
              style={{
                display: 'grid',
                gap: 'var(--spacing-lg)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              }}
            >
              <SupportTicketStatusControl ticket={ticket} />
              <SupportTicketPriorityControl ticket={ticket} />
            </div>
          </CanAccessAny>
          <CanAccessAny permissions={SUPPORT_TICKET_ASSIGN_PERMISSIONS}>
            <SupportTicketAssignmentControl ticket={ticket} />
          </CanAccessAny>
          <SupportTicketNotesPanel ticketId={ticket.ticketId} />
          <SupportTicketAuditTable ticketId={ticket.ticketId} />
        </>
      ) : null}
    </div>
  );
}
