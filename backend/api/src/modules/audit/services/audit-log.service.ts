import { logger } from '../../../config/logger';
import { createAuditLog } from '../repositories/audit-log.repository';
import type { CreateAuditLogInput } from '../types/audit-log.types';

export const writeAuditLog = async (
  input: CreateAuditLogInput,
): Promise<void> => {
  try {
    await createAuditLog(input);
  } catch (error) {
    logger.warn(
      {
        error: error instanceof Error ? error.message : 'Unknown audit error',
        eventType: input.eventType,
        requestId: input.requestId,
        traceId: input.traceId,
      },
      'Audit log write failed',
    );
  }
};
