import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  createStoreController,
  deleteStoreController,
  getStoreByIdController,
  listStoresController,
  updateStoreController,
} from '../controllers/store.controller';
import {
  createStoreBodyValidator,
  listStoresQueryValidator,
  storeIdParamsValidator,
  updateStoreBodyValidator,
} from '../validators/store.validators';

const router = Router();

const storesRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORES,
  AUTH_PERMISSION_ACTION.READ,
);
const storesCreate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORES,
  AUTH_PERMISSION_ACTION.CREATE,
);
const storesUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORES,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const storesDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORES,
  AUTH_PERMISSION_ACTION.DELETE,
);

router.get(
  '/',
  requirePermission(storesRead),
  validateRequest({ query: listStoresQueryValidator }),
  listStoresController,
);

router.post(
  '/',
  requirePermission(storesCreate),
  validateRequest({ body: createStoreBodyValidator }),
  createStoreController,
);

router.get(
  '/:storeId',
  requirePermission(storesRead),
  validateRequest({ params: storeIdParamsValidator }),
  getStoreByIdController,
);

router.patch(
  '/:storeId',
  requirePermission(storesUpdate),
  validateRequest({ params: storeIdParamsValidator }),
  validateRequest({ body: updateStoreBodyValidator }),
  updateStoreController,
);

router.delete(
  '/:storeId',
  requirePermission(storesDelete),
  validateRequest({ params: storeIdParamsValidator }),
  deleteStoreController,
);

export default router;
