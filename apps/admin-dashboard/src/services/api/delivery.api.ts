import { apiClient } from './client';

// ---------------------------------------------------------------------------
// Types mirroring the backend contract (phase-6-admin-delivery-operations-api.md)
// ---------------------------------------------------------------------------

export type DeliveryStatus =
  | 'pending_assignment'
  | 'assigned'
  | 'en_route_to_store'
  | 'arrived_at_store'
  | 'picked_up'
  | 'en_route_to_customer'
  | 'arrived_at_customer'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface AdminDeliveryListQuery {
  status?: DeliveryStatus;
  agentId?: string;
  storeId?: string;
  cityId?: string;
  page?: number;
  limit?: number;
}

export interface AdminDeliveryListItem {
  deliveryId: string;
  orderId: string;
  storeId: string;
  cityId: string;
  deliveryAgentId: string | null;
  deliveryStatus: DeliveryStatus;
  assignedAt: string | null;
  pickedUpAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface AdminAgentSnapshot {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string | null;
  profilePhotoUrl: string | null;
}

export interface AdminDeliveryTimelineEvent {
  actorType: 'system' | 'delivery_agent' | 'admin';
  actorId: string | null;
  fromStatus: string;
  toStatus: string;
  reason: string | null;
  createdAt: string;
}

export interface AdminDeliveryDetailResponse {
  deliveryId: string;
  orderId: string;
  customerId: string;
  storeId: string;
  cityId: string;
  deliveryAgentId: string | null;
  deliveryStatus: DeliveryStatus;
  assignedAt: string | null;
  arrivedAtStoreAt: string | null;
  pickedUpAt: string | null;
  enRouteToCustomerAt: string | null;
  arrivedAtCustomerAt: string | null;
  completedAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  timeline: AdminDeliveryTimelineEvent[];
  createdAt: string;
  updatedAt: string;
  agentSnapshot: AdminAgentSnapshot | null;
}

export interface AdminDeliveryOverrideBody {
  targetStatus: 'cancelled' | 'failed';
  reason: string;
}

export interface AdminDeliveryListResponse {
  items: AdminDeliveryListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// ---------------------------------------------------------------------------
// API Fetchers
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/admin/deliveries
 * Requires delivery:monitor permission.
 */
export const listAdminDeliveriesApi = async (
  params: AdminDeliveryListQuery = {},
): Promise<AdminDeliveryListResponse> => {
  const response = await apiClient.get<{ data: AdminDeliveryListResponse }>('/api/v1/admin/deliveries', { params });
  return response.data.data;
};

/**
 * GET /api/v1/admin/deliveries/:deliveryId
 * Requires delivery:read permission.
 */
export const getAdminDeliveryDetailApi = async (
  deliveryId: string,
): Promise<AdminDeliveryDetailResponse> => {
  const response = await apiClient.get<{ data: AdminDeliveryDetailResponse }>(
    `/api/v1/admin/deliveries/${deliveryId}`,
  );
  return response.data.data;
};

/**
 * POST /api/v1/admin/deliveries/:deliveryId/override
 * Requires delivery:update permission.
 */
export const overrideDeliveryApi = async (
  deliveryId: string,
  body: AdminDeliveryOverrideBody,
): Promise<{ deliveryId: string; deliveryStatus: DeliveryStatus }> => {
  const response = await apiClient.post<{
    data: { deliveryId: string; deliveryStatus: DeliveryStatus };
  }>(`/api/v1/admin/deliveries/${deliveryId}/override`, body);
  return response.data.data;
};
