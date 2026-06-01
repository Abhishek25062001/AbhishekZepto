import type { Types } from 'mongoose';
import type { ADMIN_ACTION_TYPE } from '../constants/admin-action-types';

export type AdminActionType =
  (typeof ADMIN_ACTION_TYPE)[keyof typeof ADMIN_ACTION_TYPE]
  | 'STORE_REOPEN'
  | 'AGENT_RESTORE_ONLINE';

export type AdminActionAuditRecord = {
  adminId: Types.ObjectId;
  actionType: AdminActionType;
  entityType: string;
  entityId: Types.ObjectId;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminActionAuditInput = {
  adminId: string;
  actionType: AdminActionType;
  entityType: string;
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};
