import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  listAdminUserSessionsController,
  revokeAdminUserSessionController,
  revokeAllAdminUserSessionsController,
} from '../controllers/admin-session.controller';
import { requireAnyPermission } from '../middlewares/require-any-permission.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../constants/auth-permission.constants';
import { createPermissionCode } from '../utils/permission-code.util';
import {
  adminUserIdParamValidator,
  adminUserSessionParamsValidator,
} from '../validators/session.validators';

const router = Router();

const sessionReadPermissions = [
  createPermissionCode(AUTH_PERMISSION_RESOURCE.AUTH, AUTH_PERMISSION_ACTION.READ),
  createPermissionCode(AUTH_PERMISSION_RESOURCE.USERS, AUTH_PERMISSION_ACTION.READ),
  createPermissionCode(AUTH_PERMISSION_RESOURCE.SETTINGS, AUTH_PERMISSION_ACTION.MANAGE),
] as const;

const sessionRevokePermissions = [
  createPermissionCode(AUTH_PERMISSION_RESOURCE.AUTH, AUTH_PERMISSION_ACTION.MANAGE),
] as const;

router.get(
  '/:userId/sessions',
  requireAnyPermission(sessionReadPermissions),
  validateRequest(adminUserIdParamValidator),
  listAdminUserSessionsController,
);

router.delete(
  '/:userId/sessions/:sessionId',
  requireAnyPermission(sessionRevokePermissions),
  validateRequest(adminUserSessionParamsValidator),
  revokeAdminUserSessionController,
);

router.delete(
  '/:userId/sessions',
  requireAnyPermission(sessionRevokePermissions),
  validateRequest(adminUserIdParamValidator),
  revokeAllAdminUserSessionsController,
);

export default router;
