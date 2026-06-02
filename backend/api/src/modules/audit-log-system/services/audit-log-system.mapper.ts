import type {
  AuditLogRecord,
  AuditLogResponse,
} from '../types/audit-log-system.types';

export const mapAuditLog = (auditLog: AuditLogRecord): AuditLogResponse => ({
  id: auditLog._id.toString(),
  adminId: auditLog.adminId.toString(),
  actionType: auditLog.actionType,
  entityType: auditLog.entityType,
  entityId: auditLog.entityId.toString(),
  beforeState: auditLog.beforeState,
  afterState: auditLog.afterState,
  reason: auditLog.reason,
  ipAddress: auditLog.ipAddress,
  deviceInfo: auditLog.deviceInfo,
  createdAt: auditLog.createdAt,
  updatedAt: auditLog.updatedAt,
});
