import { z } from 'zod';

const AUDIT_LOG_DEFAULT_PAGE = 1;
const AUDIT_LOG_DEFAULT_LIMIT = 20;
const AUDIT_LOG_MAX_LIMIT = 100;

const objectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/);

const dateSchema = z.coerce.date().refine((value) => !Number.isNaN(value.getTime()), {
  message: 'Invalid date',
});

export const auditLogIdParamValidator = {
  params: z.object({
    auditLogId: objectIdSchema,
  }),
};

export const listAuditLogsQueryValidator = {
  query: z.object({
    adminId: objectIdSchema.optional(),
    actionType: z.string().trim().min(1).max(120).optional(),
    entityType: z.string().trim().min(1).max(120).optional(),
    entityId: objectIdSchema.optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
    page: z.coerce.number().int().min(1).default(AUDIT_LOG_DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(AUDIT_LOG_MAX_LIMIT).default(
      AUDIT_LOG_DEFAULT_LIMIT,
    ),
  }),
};
