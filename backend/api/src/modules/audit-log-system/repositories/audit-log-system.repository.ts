import { Types } from 'mongoose';

import { AdminActionAuditModel } from '../../admin-control/models/admin-action-audit.model';
import type {
  AuditLogRecord,
  ListAuditLogsInput,
} from '../types/audit-log-system.types';

const buildAuditLogFilter = ({
  adminId,
  actionType,
  entityType,
  entityId,
  from,
  to,
}: ListAuditLogsInput): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (adminId) {
    filter.adminId = new Types.ObjectId(adminId);
  }

  if (actionType) {
    filter.actionType = actionType;
  }

  if (entityType) {
    filter.entityType = entityType;
  }

  if (entityId) {
    filter.entityId = new Types.ObjectId(entityId);
  }

  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {}),
    };
  }

  return filter;
};

export const listAuditLogRecords = async (
  input: ListAuditLogsInput,
): Promise<{ items: AuditLogRecord[]; total: number }> => {
  const filter = buildAuditLogFilter(input);
  const skip = (input.page - 1) * input.limit;

  const [items, total] = await Promise.all([
    AdminActionAuditModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).lean().exec(),
    AdminActionAuditModel.countDocuments(filter).exec(),
  ]);

  return { items: items as AuditLogRecord[], total };
};

export const findAuditLogRecordById = async (
  auditLogId: string,
): Promise<AuditLogRecord | null> => {
  if (!Types.ObjectId.isValid(auditLogId)) {
    return null;
  }

  return AdminActionAuditModel.findById(auditLogId).lean().exec() as Promise<AuditLogRecord | null>;
};
