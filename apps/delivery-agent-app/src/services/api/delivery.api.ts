import { apiClient } from './client';
import type { ApiSuccessResponse } from '../../types/api.types';
import type {
  DeliveryAgentProfile,
  DeliveryAgentStatus,
  UpdateProfileDto,
  DeliveryAssignmentResponse,
  PickupVerificationPayload,
  DeliveryCompletionPayload,
  DeliveryFailurePayload,
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

/**
 * POST /api/v1/delivery/assignments/:assignmentId/arrived-at-store
 *
 * Transitions the active delivery assignment from `en_route_to_store` to
 * `arrived_at_store`.
 */
export const markArrivedAtStore = async (
  assignmentId: string,
): Promise<ApiSuccessResponse<DeliveryAssignmentResponse>> => {
  const response = await apiClient.post<
    ApiSuccessResponse<DeliveryAssignmentResponse>
  >(`/api/v1/delivery/assignments/${assignmentId}/arrived-at-store`);
  return response.data;
};

/**
 * POST /api/v1/delivery/assignments/:assignmentId/picked-up
 *
 * Transitions the active delivery assignment from `arrived_at_store` to
 * `picked_up`. Accepts optional placeholder verification metadata.
 */
export const markPickedUp = async (
  assignmentId: string,
  verificationData?: PickupVerificationPayload,
): Promise<ApiSuccessResponse<DeliveryAssignmentResponse>> => {
  const response = await apiClient.post<
    ApiSuccessResponse<DeliveryAssignmentResponse>
  >(
    `/api/v1/delivery/assignments/${assignmentId}/picked-up`,
    verificationData ?? {},
  );
  return response.data;
};

/**
 * POST /api/v1/delivery/assignments/:assignmentId/en-route-to-customer
 *
 * Transitions the active delivery assignment from `picked_up` to `en_route_to_customer`.
 */
export const markEnRouteToCustomer = async (
  assignmentId: string,
): Promise<ApiSuccessResponse<DeliveryAssignmentResponse>> => {
  const response = await apiClient.post<
    ApiSuccessResponse<DeliveryAssignmentResponse>
  >(`/api/v1/delivery/assignments/${assignmentId}/en-route-to-customer`);
  return response.data;
};

/**
 * POST /api/v1/delivery/assignments/:assignmentId/arrived-at-customer
 *
 * Transitions the active delivery assignment from `en_route_to_customer` to `arrived_at_customer`.
 */
export const markArrivedAtCustomer = async (
  assignmentId: string,
): Promise<ApiSuccessResponse<DeliveryAssignmentResponse>> => {
  const response = await apiClient.post<
    ApiSuccessResponse<DeliveryAssignmentResponse>
  >(`/api/v1/delivery/assignments/${assignmentId}/arrived-at-customer`);
  return response.data;
};

/**
 * POST /api/v1/delivery/assignments/:assignmentId/delivered
 *
 * Transitions the active delivery assignment from `arrived_at_customer` to `delivered`.
 */
export const markDelivered = async (
  assignmentId: string,
  payload?: DeliveryCompletionPayload,
): Promise<ApiSuccessResponse<DeliveryAssignmentResponse>> => {
  const response = await apiClient.post<
    ApiSuccessResponse<DeliveryAssignmentResponse>
  >(`/api/v1/delivery/assignments/${assignmentId}/delivered`, payload ?? {});
  return response.data;
};

/**
 * POST /api/v1/delivery/assignments/:assignmentId/failed
 *
 * Transitions the active delivery assignment from an active progress state to `failed`.
 */
export const markFailed = async (
  assignmentId: string,
  payload: DeliveryFailurePayload,
): Promise<ApiSuccessResponse<DeliveryAssignmentResponse>> => {
  const response = await apiClient.post<
    ApiSuccessResponse<DeliveryAssignmentResponse>
  >(`/api/v1/delivery/assignments/${assignmentId}/failed`, payload);
  return response.data;
};

