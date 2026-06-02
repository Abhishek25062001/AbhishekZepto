import { useQuery } from '@tanstack/react-query';

import { listAdminDeliveryAgentAudit } from '../api/admin-delivery-agents.api';
import type { AdminDeliveryAgentAuditQuery } from '../types/admin-delivery-agents.types';
import { adminDeliveryAgentsQueryKeys } from './useAdminDeliveryAgents';

export const useAdminDeliveryAgentAudit = (
  deliveryAgentId: string,
  query: AdminDeliveryAgentAuditQuery = {},
) => useQuery({
  enabled: Boolean(deliveryAgentId),
  queryKey: adminDeliveryAgentsQueryKeys.audit(deliveryAgentId, query),
  queryFn: () => listAdminDeliveryAgentAudit(deliveryAgentId, query),
});

