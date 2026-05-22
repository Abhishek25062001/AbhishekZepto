import { apiClient } from './client';
import type { ApiSuccessResponse } from '../../types/api.types';
import type {
  DeliveryAgentProfile,
  DeliveryAgentStatus,
  UpdateProfileDto,
} from '../../types/delivery.types';

export const fetchAgentProfile = async (): Promise<
  ApiSuccessResponse<DeliveryAgentProfile>
> => {
  const response = await apiClient.get<ApiSuccessResponse<DeliveryAgentProfile>>(
    '/api/v1/delivery/profile',
  );
  return response.data;
};

export const updateAgentProfile = async (
  body: UpdateProfileDto,
): Promise<ApiSuccessResponse<DeliveryAgentProfile>> => {
  const response = await apiClient.patch<
    ApiSuccessResponse<DeliveryAgentProfile>
  >('/api/v1/delivery/profile', body);
  return response.data;
};

export const updateAgentAvailabilityStatus = async (
  status: 'online' | 'offline',
): Promise<ApiSuccessResponse<DeliveryAgentProfile>> => {
  const response = await apiClient.patch<
    ApiSuccessResponse<DeliveryAgentProfile>
  >('/api/v1/delivery/availability', { status });
  return response.data;
};

export const fetchAgentAvailabilityStatus = async (): Promise<
  ApiSuccessResponse<DeliveryAgentStatus>
> => {
  const response = await apiClient.get<ApiSuccessResponse<DeliveryAgentStatus>>(
    '/api/v1/delivery/status',
  );
  return response.data;
};
