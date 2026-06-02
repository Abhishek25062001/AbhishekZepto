import { useQuery } from '@tanstack/react-query';

import { getSupportTicket } from '../api/support.api';
import { supportQueryKeys } from './useSupportTickets';

export const useSupportTicketDetail = (ticketId: string) => useQuery({
  enabled: Boolean(ticketId),
  queryKey: supportQueryKeys.detail(ticketId),
  queryFn: () => getSupportTicket(ticketId),
});
