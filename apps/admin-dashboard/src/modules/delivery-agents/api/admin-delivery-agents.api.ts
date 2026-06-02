import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  AdminDeliveryAgentAssignmentsQuery,
  AdminDeliveryAgentAssignmentsResponse,
  AdminDeliveryAgentAssignmentsResult,
  AdminDeliveryAgentAuditQuery,
  AdminDeliveryAgentAuditResponse,
  AdminDeliveryAgentAuditResult,
  AdminDeliveryAgentListQuery,
  AdminDeliveryAgentListResponse,
  AdminDeliveryAgentListResult,
  AdminDeliveryAgentSummary,
  DeliveryAgentStatusPayload,
  DeliveryAgentVerificationPayload,
} from '../types/admin-delivery-agents.types';

const BASE = '/api/v1/admin/delivery-agents';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

const toPagination = <T extends { items: unknown[]; page: number; limit: number; total: number }>(
  data: T,
) => {
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return {
    items: data.items,
    pagination: {
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages,
      hasNextPage: data.page < totalPages,
      hasPreviousPage: data.page > 1,
    },
  };
};

export const listAdminDeliveryAgents = async (
  query: AdminDeliveryAgentListQuery = {},
): Promise<AdminDeliveryAgentListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminDeliveryAgentListResponse>>(
    BASE,
    { params: query },
  );
  return toPagination(response.data.data) as AdminDeliveryAgentListResult;
};

export const getAdminDeliveryAgent = async (
  deliveryAgentId: string,
): Promise<AdminDeliveryAgentSummary> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminDeliveryAgentSummary>>(
    `${BASE}/${deliveryAgentId}`,
  );
  return unwrapData(response.data);
};

export const updateAdminDeliveryAgentStatus = async (
  deliveryAgentId: string,
  payload: DeliveryAgentStatusPayload,
): Promise<AdminDeliveryAgentSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminDeliveryAgentSummary>>(
    `${BASE}/${deliveryAgentId}/status`,
    payload,
  );
  return unwrapData(response.data);
};

export const updateAdminDeliveryAgentVerification = async (
  deliveryAgentId: string,
  payload: DeliveryAgentVerificationPayload,
): Promise<AdminDeliveryAgentSummary> => {
  const response = await apiClient.patch<ApiSuccessResponse<AdminDeliveryAgentSummary>>(
    `${BASE}/${deliveryAgentId}/verification`,
    payload,
  );
  return unwrapData(response.data);
};

export const listAdminDeliveryAgentAssignments = async (
  deliveryAgentId: string,
  query: AdminDeliveryAgentAssignmentsQuery = {},
): Promise<AdminDeliveryAgentAssignmentsResult> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminDeliveryAgentAssignmentsResponse>>(
    `${BASE}/${deliveryAgentId}/assignments`,
    { params: query },
  );
  return toPagination(response.data.data) as AdminDeliveryAgentAssignmentsResult;
};

export const listAdminDeliveryAgentAudit = async (
  deliveryAgentId: string,
  query: AdminDeliveryAgentAuditQuery = {},
): Promise<AdminDeliveryAgentAuditResult> => {
  const response = await apiClient.get<ApiSuccessResponse<AdminDeliveryAgentAuditResponse>>(
    `${BASE}/${deliveryAgentId}/audit`,
    { params: query },
  );
  return toPagination(response.data.data) as AdminDeliveryAgentAuditResult;
};

