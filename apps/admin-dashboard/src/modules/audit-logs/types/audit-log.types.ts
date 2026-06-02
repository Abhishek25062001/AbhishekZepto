import type { ApiPaginationMeta } from '../../../types/api.types';

export type AuditLogRecord = {
  id: string;
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
  updatedAt: string;
};

export type AuditLogsListQuery = {
  adminId?: string;
  actionType?: string;
  entityType?: string;
  entityId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export type AuditLogsListResponse = {
  items: AuditLogRecord[];
  page: number;
  limit: number;
  total: number;
};

export type AuditLogsListResult = {
  items: AuditLogRecord[];
  pagination: ApiPaginationMeta;
};
