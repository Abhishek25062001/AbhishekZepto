import type { Request, Response } from 'express';

import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';
import {
  getAuditLogForAdmin,
  listAuditLogsForAdmin,
} from '../services/audit-log-system.service';

export const listAuditLogsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await listAuditLogsForAdmin(
    req.query as unknown as Parameters<typeof listAuditLogsForAdmin>[0],
  );

  return sendSuccessResponse({
    res,
    message: 'Audit logs fetched successfully',
    data: result,
  });
});

export const getAuditLogController = asyncHandler(async (req: Request, res: Response) => {
  const { auditLogId } = req.params as { auditLogId: string };
  const result = await getAuditLogForAdmin(auditLogId);

  return sendSuccessResponse({
    res,
    message: 'Audit log fetched successfully',
    data: result,
  });
});
