import { useQuery } from '@tanstack/react-query';

import { listAuditLogs } from '../api/audit-log.api';
import type { AuditLogsListQuery } from '../types/audit-log.types';

export const auditLogQueryKeys = {
  all: ['audit-logs'] as const,
  list: (query: AuditLogsListQuery) => [...auditLogQueryKeys.all, 'list', query] as const,
  detail: (auditLogId: string) => [...auditLogQueryKeys.all, 'detail', auditLogId] as const,
};

export const useAuditLogs = (query: AuditLogsListQuery = {}) => useQuery({
  queryKey: auditLogQueryKeys.list(query),
  queryFn: () => listAuditLogs(query),
});
