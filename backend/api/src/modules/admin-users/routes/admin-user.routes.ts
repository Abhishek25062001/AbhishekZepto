import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { ADMIN_USER_PERMISSION_GROUPS } from '../constants/admin-user-permissions.constants';
import {
  createAdminUserController,
  getAdminUserController,
  listAdminUserAuditController,
  listAdminUsersController,
  updateAdminUserController,
  updateAdminUserPermissionsController,
  updateAdminUserRoleController,
  updateAdminUserStatusController,
} from '../controllers/admin-user.controller';
import {
  adminUserIdParamValidator,
  adminUserPermissionsValidator,
  adminUserRoleValidator,
  adminUserStatusValidator,
  createAdminUserValidator,
  listAdminUsersQueryValidator,
  updateAdminUserValidator,
} from '../validators/admin-user.validator';

const router = Router();

router.post('/', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.CREATE), validateRequest(createAdminUserValidator), createAdminUserController);
router.get('/', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.READ), validateRequest(listAdminUsersQueryValidator), listAdminUsersController);
router.get('/:adminUserId', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.READ), validateRequest(adminUserIdParamValidator), getAdminUserController);
router.patch('/:adminUserId', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.UPDATE), validateRequest(adminUserIdParamValidator), validateRequest(updateAdminUserValidator), updateAdminUserController);
router.patch('/:adminUserId/status', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.STATUS), validateRequest(adminUserIdParamValidator), validateRequest(adminUserStatusValidator), updateAdminUserStatusController);
router.patch('/:adminUserId/roles', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.ROLE), validateRequest(adminUserIdParamValidator), validateRequest(adminUserRoleValidator), updateAdminUserRoleController);
router.patch('/:adminUserId/permissions', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.PERMISSIONS), validateRequest(adminUserIdParamValidator), validateRequest(adminUserPermissionsValidator), updateAdminUserPermissionsController);
router.get('/:adminUserId/audit', requireAnyPermission(ADMIN_USER_PERMISSION_GROUPS.AUDIT), validateRequest(adminUserIdParamValidator), listAdminUserAuditController);

export default router;
