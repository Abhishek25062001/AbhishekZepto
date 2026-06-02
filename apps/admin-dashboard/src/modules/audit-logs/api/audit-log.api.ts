import type { ApiSuccessResponse } from '../../../types/api.types';
import { apiClient } from '../../../services/api/client';
import type {
  AuditLogRecord,
  AuditLogsListQuery,
  AuditLogsListResponse,
  AuditLogsListResult,
} from '../types/audit-log.types';

const BASE = '/api/v1/admin/audit-logs';

const unwrapData = <T>(response: ApiSuccessResponse<T>): T => response.data;

const toPagination = (data: AuditLogsListResponse): AuditLogsListResult => {
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));

  return {
    items: data.items,
    pagination: {
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages,
      hasNextPage: data.page < totalPages,
      hasPreviousPage: data.page > 1,
    },
  };
};

export const listAuditLogs = async (
  query: AuditLogsListQuery = {},
): Promise<AuditLogsListResult> => {
  const response = await apiClient.get<ApiSuccessResponse<AuditLogsListResponse>>(BASE, {
    params: query,
  });
  return toPagination(response.data.data);
};

export const getAuditLog = async (auditLogId: string): Promise<AuditLogRecord> => {
  const response = await apiClient.get<ApiSuccessResponse<AuditLogRecord>>(
    `${BASE}/${auditLogId}`,
  );
  return unwrapData(response.data);
};
