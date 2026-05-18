import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../../auth/utils/permission-code.util';
import {
  expireDueInventoryLocksController,
  getInventoryLockByIdController,
  listInventoryLocksController,
} from '../controllers/inventory-lock-admin.controller';
import {
  inventoryLockIdParamsValidator,
  listInventoryLocksQueryValidator,
} from '../validators/inventory-lock.validators';

const router = Router();

const inventoryRead = createPermissionCode(AUTH_PERMISSION_RESOURCE.INVENTORY, AUTH_PERMISSION_ACTION.READ);
const inventoryAdjust = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.INVENTORY,
  AUTH_PERMISSION_ACTION.ADJUST,
);

router.get(
  '/',
  requirePermission(inventoryRead),
  validateRequest({ query: listInventoryLocksQueryValidator }),
  listInventoryLocksController,
);

router.post(
  '/expire-due',
  requirePermission(inventoryAdjust),
  expireDueInventoryLocksController,
);

router.get(
  '/:lockId',
  requirePermission(inventoryRead),
  validateRequest({ params: inventoryLockIdParamsValidator }),
  getInventoryLockByIdController,
);

export default router;
