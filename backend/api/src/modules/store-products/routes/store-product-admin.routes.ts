import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  bulkMapStoreProductsController,
  bulkUpdateStoreProductPricesController,
  bulkUpdateStoreProductVisibilityController,
  createStoreProductController,
  deleteStoreProductController,
  getStoreProductByIdController,
  listStoreProductsController,
  updateStoreProductController,
} from '../controllers/store-product.controller';
import {
  bulkMapStoreProductsBodyValidator,
  bulkUpdateStoreProductPriceBodyValidator,
  bulkUpdateStoreProductVisibilityBodyValidator,
  createStoreProductBodyValidator,
  listStoreProductsQueryValidator,
  storeProductIdParamsValidator,
  updateStoreProductBodyValidator,
} from '../validators/store-product.validators';

const router = Router();

const storeProductsRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
  AUTH_PERMISSION_ACTION.READ,
);
const storeProductsCreate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
  AUTH_PERMISSION_ACTION.CREATE,
);
const storeProductsUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const storeProductsDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
  AUTH_PERMISSION_ACTION.DELETE,
);
const storeProductsBulkUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
  AUTH_PERMISSION_ACTION.BULK_UPDATE,
);

router.get(
  '/',
  requirePermission(storeProductsRead),
  validateRequest({ query: listStoreProductsQueryValidator }),
  listStoreProductsController,
);

router.post(
  '/',
  requirePermission(storeProductsCreate),
  validateRequest({ body: createStoreProductBodyValidator }),
  createStoreProductController,
);

router.post(
  '/bulk-map',
  requirePermission(storeProductsBulkUpdate),
  validateRequest({ body: bulkMapStoreProductsBodyValidator }),
  bulkMapStoreProductsController,
);

router.patch(
  '/bulk-price',
  requirePermission(storeProductsBulkUpdate),
  validateRequest({ body: bulkUpdateStoreProductPriceBodyValidator }),
  bulkUpdateStoreProductPricesController,
);

router.patch(
  '/bulk-visibility',
  requirePermission(storeProductsBulkUpdate),
  validateRequest({ body: bulkUpdateStoreProductVisibilityBodyValidator }),
  bulkUpdateStoreProductVisibilityController,
);

router.get(
  '/:storeProductId',
  requirePermission(storeProductsRead),
  validateRequest({ params: storeProductIdParamsValidator }),
  getStoreProductByIdController,
);

router.patch(
  '/:storeProductId',
  requirePermission(storeProductsUpdate),
  validateRequest({ params: storeProductIdParamsValidator }),
  validateRequest({ body: updateStoreProductBodyValidator }),
  updateStoreProductController,
);

router.delete(
  '/:storeProductId',
  requirePermission(storeProductsDelete),
  validateRequest({ params: storeProductIdParamsValidator }),
  deleteStoreProductController,
);

export default router;
