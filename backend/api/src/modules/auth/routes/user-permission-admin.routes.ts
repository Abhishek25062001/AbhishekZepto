import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  assignUserRoleController,
  syncUserRolePermissionsController,
  updateUserPermissionsController,
} from '../controllers/user-permission.controller';
import { requireAnyPermission } from '../middlewares/require-any-permission.middleware';
import { createPermissionCode } from '../utils/permission-code.util';
import {
  assignUserRoleValidator,
  syncUserRolePermissionsValidator,
  updateUserPermissionsValidator,
  userIdParamValidator,
} from '../validators/user-permission.validators';

const router = Router();

const userPermissionManagePermissions = [createPermissionCode('settings', 'manage')] as const;

router.patch(
  '/:userId/permissions',
  requireAnyPermission(userPermissionManagePermissions),
  validateRequest(userIdParamValidator),
  validateRequest(updateUserPermissionsValidator),
  updateUserPermissionsController,
);

router.patch(
  '/:userId/role',
  requireAnyPermission(userPermissionManagePermissions),
  validateRequest(userIdParamValidator),
  validateRequest(assignUserRoleValidator),
  assignUserRoleController,
);

router.post(
  '/:userId/sync-role-permissions',
  requireAnyPermission(userPermissionManagePermissions),
  validateRequest(userIdParamValidator),
  validateRequest(syncUserRolePermissionsValidator),
  syncUserRolePermissionsController,
);

export default router;
