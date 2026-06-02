import { useQuery } from '@tanstack/react-query';

import { getAdminDeliveryAgent } from '../api/admin-delivery-agents.api';
import { adminDeliveryAgentsQueryKeys } from './useAdminDeliveryAgents';

export const useAdminDeliveryAgentDetail = (deliveryAgentId: string) => useQuery({
  enabled: Boolean(deliveryAgentId),
  queryKey: adminDeliveryAgentsQueryKeys.detail(deliveryAgentId),
  queryFn: () => getAdminDeliveryAgent(deliveryAgentId),
});

