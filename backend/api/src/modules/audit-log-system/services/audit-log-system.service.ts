import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import {
  findAuditLogRecordById,
  listAuditLogRecords,
} from '../repositories/audit-log-system.repository';
import type { ListAuditLogsInput } from '../types/audit-log-system.types';
import { mapAuditLog } from './audit-log-system.mapper';

export const listAuditLogsForAdmin = async (
  input: ListAuditLogsInput,
) => {
  const { items, total } = await listAuditLogRecords(input);

  return {
    items: items.map(mapAuditLog),
    page: input.page,
    limit: input.limit,
    total,
  };
};

export const getAuditLogForAdmin = async (auditLogId: string) => {
  const auditLog = await findAuditLogRecordById(auditLogId);

  if (!auditLog) {
    throw new AppError({
      message: 'Audit log not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.AUDIT_LOG_NOT_FOUND,
    });
  }

  return mapAuditLog(auditLog);
};
