import { createAdminActionAuditRecord } from '../repositories/admin-action-audit.repository';
import type { CreateAdminActionAuditInput } from '../types/admin-action-audit.types';

export const writeAdminActionAudit = async (
  input: CreateAdminActionAuditInput,
): Promise<void> => {
  try {
    await createAdminActionAuditRecord(input);
  } catch (error) {
    console.warn(
      'Admin action audit write failed',
      {
        actionType: input.actionType,
        entityType: input.entityType,
        entityId: input.entityId,
        error: error instanceof Error ? error.message : 'Unknown admin audit error',
      },
    );
  }
};
