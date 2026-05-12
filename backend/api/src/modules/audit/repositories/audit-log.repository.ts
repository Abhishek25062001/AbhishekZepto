import { AuditLogModel } from '../models/audit-log.model';
import type { AuditLogRecord } from '../models/audit-log.model';
import type { CreateAuditLogInput } from '../types/audit-log.types';

export const createAuditLog = async (
  input: CreateAuditLogInput,
): Promise<AuditLogRecord> => {
  return AuditLogModel.create(input);
};
