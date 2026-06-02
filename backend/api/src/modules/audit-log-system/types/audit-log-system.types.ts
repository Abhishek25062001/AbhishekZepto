import type { Types } from 'mongoose';

import type { AdminActionType } from '../../admin-control/types/admin-action-audit.types';

export type ListAuditLogsInput = {
  adminId?: string;
  actionType?: string;
  entityType?: string;
  entityId?: string;
  from?: Date;
  to?: Date;
  page: number;
  limit: number;
};

export type AuditLogRecord = {
  _id: Types.ObjectId;
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

export type AuditLogResponse = {
  id: string;
  adminId: string;
  actionType: AdminActionType;
  entityType: string;
  entityId: string;
  beforeState: Record<string, unknown>;
  afterState: Record<string, unknown>;
  reason: string;
  ipAddress: string | null;
  deviceInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ListAuditLogsResult = {
  items: AuditLogResponse[];
  page: number;
  limit: number;
  total: number;
};
