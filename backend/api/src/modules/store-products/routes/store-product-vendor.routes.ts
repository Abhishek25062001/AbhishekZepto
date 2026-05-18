import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  getVendorStoreProductByIdController,
  listVendorStoreProductsController,
  updateVendorStoreProductAvailabilityController,
  updateVendorStoreProductPriceController,
} from '../controllers/store-product-vendor.controller';
import {
  listStoreProductsQueryValidator,
  storeProductIdParamsValidator,
  vendorUpdateAvailabilityBodyValidator,
  vendorUpdatePriceBodyValidator,
} from '../validators/store-product.validators';

const router = Router();

const storeProductsRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
  AUTH_PERMISSION_ACTION.READ,
);
const storeProductsUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.STORE_PRODUCTS,
  AUTH_PERMISSION_ACTION.UPDATE,
);

router.get(
  '/',
  requirePermission(storeProductsRead),
  validateRequest({ query: listStoreProductsQueryValidator }),
  listVendorStoreProductsController,
);

router.get(
  '/:storeProductId',
  requirePermission(storeProductsRead),
  validateRequest({ params: storeProductIdParamsValidator }),
  getVendorStoreProductByIdController,
);

router.patch(
  '/:storeProductId/availability',
  requirePermission(storeProductsUpdate),
  validateRequest({ params: storeProductIdParamsValidator }),
  validateRequest({ body: vendorUpdateAvailabilityBodyValidator }),
  updateVendorStoreProductAvailabilityController,
);

router.patch(
  '/:storeProductId/price',
  requirePermission(storeProductsUpdate),
  validateRequest({ params: storeProductIdParamsValidator }),
  validateRequest({ body: vendorUpdatePriceBodyValidator }),
  updateVendorStoreProductPriceController,
);

export default router;
