import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  createRoleController,
  deleteRoleController,
  getRoleByIdController,
  listRolesController,
  updateRoleController,
} from '../controllers/role.controller';
import { requireAnyPermission } from '../middlewares/require-any-permission.middleware';
import { createPermissionCode } from '../utils/permission-code.util';
import {
  createRoleValidator,
  listRolesValidator,
  roleIdParamValidator,
  updateRoleValidator,
} from '../validators/role.validators';

const router = Router();

const roleReadPermissions = [
  createPermissionCode('users', 'read'),
  createPermissionCode('settings', 'manage'),
] as const;
const roleWritePermissions = [createPermissionCode('settings', 'manage')] as const;

router.get(
  '/',
  requireAnyPermission(roleReadPermissions),
  validateRequest(listRolesValidator),
  listRolesController,
);

router.post(
  '/',
  requireAnyPermission(roleWritePermissions),
  validateRequest(createRoleValidator),
  createRoleController,
);

router.get(
  '/:roleId',
  requireAnyPermission(roleReadPermissions),
  validateRequest(roleIdParamValidator),
  getRoleByIdController,
);

router.patch(
  '/:roleId',
  requireAnyPermission(roleWritePermissions),
  validateRequest(roleIdParamValidator),
  validateRequest(updateRoleValidator),
  updateRoleController,
);

router.delete(
  '/:roleId',
  requireAnyPermission(roleWritePermissions),
  validateRequest(roleIdParamValidator),
  deleteRoleController,
);

export default router;
