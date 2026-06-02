import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateAdminDeliveryAgentStatus,
  updateAdminDeliveryAgentVerification,
} from '../api/admin-delivery-agents.api';
import type {
  DeliveryAgentStatusPayload,
  DeliveryAgentVerificationPayload,
} from '../types/admin-delivery-agents.types';
import { adminDeliveryAgentsQueryKeys } from './useAdminDeliveryAgents';

const invalidateDeliveryAgents = async (
  queryClient: ReturnType<typeof useQueryClient>,
  deliveryAgentId: string,
) => {
  await queryClient.invalidateQueries({ queryKey: adminDeliveryAgentsQueryKeys.all });
  await queryClient.invalidateQueries({
    queryKey: adminDeliveryAgentsQueryKeys.detail(deliveryAgentId),
  });
};

export const useUpdateAdminDeliveryAgentStatusMutation = (deliveryAgentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeliveryAgentStatusPayload) =>
      updateAdminDeliveryAgentStatus(deliveryAgentId, payload),
    onSuccess: async () => invalidateDeliveryAgents(queryClient, deliveryAgentId),
  });
};

export const useUpdateAdminDeliveryAgentVerificationMutation = (deliveryAgentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeliveryAgentVerificationPayload) =>
      updateAdminDeliveryAgentVerification(deliveryAgentId, payload),
    onSuccess: async () => invalidateDeliveryAgents(queryClient, deliveryAgentId),
  });
};

