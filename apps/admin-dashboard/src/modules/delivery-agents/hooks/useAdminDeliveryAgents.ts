import { useQuery } from '@tanstack/react-query';

import { listAdminDeliveryAgents } from '../api/admin-delivery-agents.api';
import type { AdminDeliveryAgentListQuery } from '../types/admin-delivery-agents.types';

export const adminDeliveryAgentsQueryKeys = {
  all: ['admin-delivery-agents'] as const,
  list: (query: AdminDeliveryAgentListQuery) =>
    [...adminDeliveryAgentsQueryKeys.all, 'list', query] as const,
  detail: (deliveryAgentId: string) =>
    [...adminDeliveryAgentsQueryKeys.all, 'detail', deliveryAgentId] as const,
  assignments: (deliveryAgentId: string, query: unknown) =>
    [...adminDeliveryAgentsQueryKeys.all, 'assignments', deliveryAgentId, query] as const,
  audit: (deliveryAgentId: string, query: unknown) =>
    [...adminDeliveryAgentsQueryKeys.all, 'audit', deliveryAgentId, query] as const,
};

export const useAdminDeliveryAgents = (query: AdminDeliveryAgentListQuery = {}) => useQuery({
  queryKey: adminDeliveryAgentsQueryKeys.list(query),
  queryFn: () => listAdminDeliveryAgents(query),
});

