import { useQuery } from '@tanstack/react-query';

import { listAdminDeliveryAgentAssignments } from '../api/admin-delivery-agents.api';
import type { AdminDeliveryAgentAssignmentsQuery } from '../types/admin-delivery-agents.types';
import { adminDeliveryAgentsQueryKeys } from './useAdminDeliveryAgents';

export const useAdminDeliveryAgentAssignments = (
  deliveryAgentId: string,
  query: AdminDeliveryAgentAssignmentsQuery = {},
) => useQuery({
  enabled: Boolean(deliveryAgentId),
  queryKey: adminDeliveryAgentsQueryKeys.assignments(deliveryAgentId, query),
  queryFn: () => listAdminDeliveryAgentAssignments(deliveryAgentId, query),
});

