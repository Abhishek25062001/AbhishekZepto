import { Types } from 'mongoose';

import { AdminActionAuditModel } from '../models/admin-action-audit.model';
import type {
  AdminActionAuditRecord,
  CreateAdminActionAuditInput,
} from '../types/admin-action-audit.types';

export const createAdminActionAuditRecord = async (
  input: CreateAdminActionAuditInput,
): Promise<AdminActionAuditRecord> => {
  return AdminActionAuditModel.create({
    adminId: new Types.ObjectId(input.adminId),
    actionType: input.actionType,
    entityType: input.entityType,
    entityId: new Types.ObjectId(input.entityId),
    beforeState: input.beforeState,
    afterState: input.afterState,
    reason: input.reason,
    ipAddress: input.ipAddress ?? null,
    deviceInfo: input.deviceInfo ?? null,
  });
};
