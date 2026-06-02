import { useQuery } from '@tanstack/react-query';

import { getAuditLog } from '../api/audit-log.api';
import { auditLogQueryKeys } from './useAuditLogs';

export const useAuditLogDetail = (auditLogId: string) => useQuery({
  queryKey: auditLogQueryKeys.detail(auditLogId),
  queryFn: () => getAuditLog(auditLogId),
  enabled: auditLogId.length > 0,
});
