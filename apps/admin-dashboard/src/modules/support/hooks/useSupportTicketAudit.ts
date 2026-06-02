import { useQuery } from '@tanstack/react-query';

import { listSupportTicketAudit } from '../api/support.api';
import { supportQueryKeys } from './useSupportTickets';

export const useSupportTicketAudit = (ticketId: string) => useQuery({
  enabled: Boolean(ticketId),
  queryKey: supportQueryKeys.audit(ticketId),
  queryFn: () => listSupportTicketAudit(ticketId),
});
