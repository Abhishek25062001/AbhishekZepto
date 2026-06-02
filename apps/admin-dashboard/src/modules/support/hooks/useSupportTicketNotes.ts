import { useQuery } from '@tanstack/react-query';

import { listSupportTicketNotes } from '../api/support.api';
import { supportQueryKeys } from './useSupportTickets';

export const useSupportTicketNotes = (ticketId: string) => useQuery({
  enabled: Boolean(ticketId),
  queryKey: supportQueryKeys.notes(ticketId),
  queryFn: () => listSupportTicketNotes(ticketId),
});
