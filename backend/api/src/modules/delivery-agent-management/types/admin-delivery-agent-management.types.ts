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

export type ListDeliveryAgentsInput = {
  status?: 'active' | 'inactive';
  availabilityStatus?: 'online' | 'offline';
  verificationStatus?: 'verified' | 'unverified';
  cityId?: string;
  actorCityId?: string | null;
  search?: string;
  page: number;
  limit: number;
};

export type DeliveryAgentManagementStatus = 'active' | 'inactive';
export type DeliveryAgentManagementVerificationStatus = 'verified' | 'unverified';

export type PaginatedDeliveryAgents = {
  items: AdminDeliveryAgentSummary[];
  page: number;
  limit: number;
  total: number;
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

export type AdminDeliveryAgentAuditSummary = {
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

export type ListDeliveryAgentAssignmentsInput = {
  deliveryAgentId: string;
  actorCityId?: string | null;
  status?: string;
  fromDate?: Date;
  toDate?: Date;
  page: number;
  limit: number;
};

export type ListDeliveryAgentAuditInput = {
  deliveryAgentId: string;
  actorCityId?: string | null;
  page: number;
  limit: number;
};

export type PaginatedDeliveryAgentAssignments = {
  items: AdminDeliveryAgentAssignmentSummary[];
  page: number;
  limit: number;
  total: number;
};

export type PaginatedDeliveryAgentAudit = {
  items: AdminDeliveryAgentAuditSummary[];
  page: number;
  limit: number;
  total: number;
};
