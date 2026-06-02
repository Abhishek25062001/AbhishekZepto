import { useQuery } from '@tanstack/react-query';

import { listSupportTickets } from '../api/support.api';
import type { SupportTicketListQuery } from '../types/support.types';

export const supportQueryKeys = {
  all: ['support-tickets'] as const,
  list: (query: SupportTicketListQuery) => [...supportQueryKeys.all, 'list', query] as const,
  detail: (ticketId: string) => [...supportQueryKeys.all, 'detail', ticketId] as const,
  notes: (ticketId: string) => [...supportQueryKeys.all, 'notes', ticketId] as const,
  audit: (ticketId: string) => [...supportQueryKeys.all, 'audit', ticketId] as const,
};

export const useSupportTickets = (query: SupportTicketListQuery = {}) => useQuery({
  queryKey: supportQueryKeys.list(query),
  queryFn: () => listSupportTickets(query),
});
