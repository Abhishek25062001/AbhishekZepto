import type { AdminActionAuditRecord } from '../../admin-control/types/admin-action-audit.types';
import type { IDeliveryAssignmentDocument } from '../../delivery/types/delivery-assignment.types';
import type { IDeliveryAgentDocument } from '../../delivery/types/delivery-agent.types';
import type {
  AdminDeliveryAgentAssignmentSummary,
  AdminDeliveryAgentAuditSummary,
  AdminDeliveryAgentSummary,
} from '../types/admin-delivery-agent-management.types';

const toIso = (date?: Date | null): string | null => date ? date.toISOString() : null;
const toId = (value?: { toString: () => string } | null): string | null => value ? value.toString() : null;

export const mapAdminDeliveryAgentSummary = (
  agent: IDeliveryAgentDocument,
): AdminDeliveryAgentSummary => ({
  agentId: agent._id.toString(),
  userId: agent.userId.toString(),
  name: agent.name,
  phone: agent.phone,
  email: agent.email,
  profilePhotoUrl: agent.profilePhotoUrl,
  vehicleType: agent.vehicleType,
  vehicleNumber: agent.vehicleNumber,
  availabilityStatus: agent.availabilityStatus,
  forcedOfflineAt: toIso(agent.forcedOfflineAt),
  forcedOfflineReason: agent.forcedOfflineReason ?? null,
  forcedOfflineBy: toId(agent.forcedOfflineBy),
  isVerified: agent.isVerified,
  isActive: agent.isActive,
  cityId: toId(agent.cityId),
  currentAssignmentId: toId(agent.currentAssignmentId),
  totalDeliveries: agent.totalDeliveries,
  createdAt: agent.createdAt.toISOString(),
  updatedAt: agent.updatedAt.toISOString(),
});

export const mapAdminDeliveryAgentAssignmentSummary = (
  assignment: IDeliveryAssignmentDocument,
): AdminDeliveryAgentAssignmentSummary => ({
  deliveryId: assignment._id.toString(),
  orderId: assignment.orderId.toString(),
  customerId: assignment.customerId.toString(),
  storeId: assignment.storeId.toString(),
  cityId: assignment.cityId.toString(),
  deliveryAgentId: toId(assignment.deliveryAgentId),
  deliveryStatus: assignment.deliveryStatus,
  assignmentSource: assignment.assignmentSource ?? null,
  assignedAt: toIso(assignment.assignedAt),
  pickedUpAt: toIso(assignment.pickedUpAt),
  completedAt: toIso(assignment.completedAt),
  deliveredAt: toIso(assignment.deliveredAt),
  failedAt: toIso(assignment.failedAt),
  cancelledAt: toIso(assignment.cancelledAt),
  failureReason: assignment.failureReason,
  cancellationReason: assignment.cancellationReason,
  createdAt: assignment.createdAt.toISOString(),
  updatedAt: assignment.updatedAt.toISOString(),
});

export const mapAdminDeliveryAgentAuditSummary = (
  audit: AdminActionAuditRecord & { _id?: { toString: () => string } },
): AdminDeliveryAgentAuditSummary => ({
  auditId: audit._id?.toString() ?? '',
  adminId: audit.adminId.toString(),
  actionType: audit.actionType,
  entityType: audit.entityType,
  entityId: audit.entityId.toString(),
  beforeState: audit.beforeState,
  afterState: audit.afterState,
  reason: audit.reason,
  ipAddress: audit.ipAddress,
  deviceInfo: audit.deviceInfo,
  createdAt: audit.createdAt.toISOString(),
});
