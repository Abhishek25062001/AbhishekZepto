import type { ApiPaginationMeta } from '../../../types/api.types';

export type DeliveryAgentManagementStatus = 'active' | 'inactive';
export type DeliveryAgentAvailabilityStatus = 'online' | 'offline';
export type DeliveryAgentVerificationStatus = 'verified' | 'unverified';

export type AdminDeliveryAgentSummary = {
  agentId: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  profilePhotoUrl: string | null;
  vehicleType: string;
  vehicleNumber: string | null;
  availabilityStatus: string;
  forcedOfflineAt: string | null;
  forcedOfflineReason: string | null;
  forcedOfflineBy: string | null;
  isVerified: boolean;
  isActive: boolean;
  cityId: string | null;
  currentAssignmentId: string | null;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminDeliveryAgentListQuery = {
  status?: DeliveryAgentManagementStatus;
  availabilityStatus?: DeliveryAgentAvailabilityStatus;
  verificationStatus?: DeliveryAgentVerificationStatus;
  cityId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type AdminDeliveryAgentListResponse = {
  items: AdminDeliveryAgentSummary[];
  page: number;
  limit: number;
  total: number;
};

export type AdminDeliveryAgentListResult = {
  items: AdminDeliveryAgentSummary[];
  pagination: ApiPaginationMeta;
};

export type AdminDeliveryAgentAssignmentSummary = {
  deliveryId: string;
  orderId: string;
  customerId: string;
  storeId: string;
  cityId: string;
  deliveryAgentId: string | null;
  deliveryStatus: string;
  assignmentSource: string | null;
  assignedAt: string | null;
  pickedUpAt: string | null;
  completedAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  cancelledAt: string | null;
  failureReason: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminDeliveryAgentAssignmentsQuery = {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
};

export type AdminDeliveryAgentAssignmentsResponse = {
  items: AdminDeliveryAgentAssignmentSummary[];
  page: number;
  limit: number;
  total: number;
};

export type AdminDeliveryAgentAssignmentsResult = {
  items: AdminDeliveryAgentAssignmentSummary[];
  pagination: ApiPaginationMeta;
};

export type AdminDeliveryAgentAuditRecord = {
  auditId: string;
  adminId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: string;
};

export type AdminDeliveryAgentAuditQuery = {
  page?: number;
  limit?: number;
};

export type AdminDeliveryAgentAuditResponse = {
  items: AdminDeliveryAgentAuditRecord[];
  page: number;
  limit: number;
  total: number;
};

export type AdminDeliveryAgentAuditResult = {
  items: AdminDeliveryAgentAuditRecord[];
  pagination: ApiPaginationMeta;
};

export type DeliveryAgentStatusPayload = {
  status: DeliveryAgentManagementStatus;
  reason: string;
};

export type DeliveryAgentVerificationPayload = {
  verificationStatus: DeliveryAgentVerificationStatus;
  reason: string;
};

