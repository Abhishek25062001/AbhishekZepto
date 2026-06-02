import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { AUDIT_LOG_SYSTEM_PERMISSION_GROUPS } from '../constants/audit-log-system-permissions.constants';
import {
  getAuditLogController,
  listAuditLogsController,
} from '../controllers/audit-log-system.controller';
import {
  auditLogIdParamValidator,
  listAuditLogsQueryValidator,
} from '../validators/audit-log-system.validator';

const router = Router();

router.get(
  '/',
  requireAnyPermission(AUDIT_LOG_SYSTEM_PERMISSION_GROUPS.READ),
  validateRequest(listAuditLogsQueryValidator),
  listAuditLogsController,
);

router.get(
  '/:auditLogId',
  requireAnyPermission(AUDIT_LOG_SYSTEM_PERMISSION_GROUPS.READ),
  validateRequest(auditLogIdParamValidator),
  getAuditLogController,
);

export default router;
