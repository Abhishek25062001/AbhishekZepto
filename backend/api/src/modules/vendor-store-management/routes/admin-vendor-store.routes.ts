import { Router } from 'express';

import { requireAnyPermission } from '../../auth/middlewares/require-any-permission.middleware';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS } from '../constants/admin-vendor-store-permissions.constants';
import {
  getStoreController,
  getVendorController,
  listStoreAuditController,
  listStoreInventoryController,
  listStoreOrdersController,
  listStoresController,
  listVendorsController,
  updateStoreStatusController,
  updateVendorStatusController,
} from '../controllers/admin-vendor-store.controller';
import {
  listStoresQueryValidator,
  listVendorsQueryValidator,
  storeIdParamValidator,
  storeInspectionQueryValidator,
  updateStoreStatusValidator,
  updateVendorStatusValidator,
  vendorIdParamValidator,
} from '../validators/admin-vendor-store.validator';

const router = Router();

router.get('/vendors', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.VENDOR_READ), validateRequest(listVendorsQueryValidator), listVendorsController);
router.get('/vendors/:vendorId', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.VENDOR_READ), validateRequest(vendorIdParamValidator), getVendorController);
router.patch('/vendors/:vendorId/status', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.VENDOR_STATUS), validateRequest(vendorIdParamValidator), validateRequest(updateVendorStatusValidator), updateVendorStatusController);
router.get('/stores', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_READ), validateRequest(listStoresQueryValidator), listStoresController);
router.get('/stores/:storeId/orders', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_READ), validateRequest(storeIdParamValidator), validateRequest(storeInspectionQueryValidator), listStoreOrdersController);
router.get('/stores/:storeId/inventory', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_READ), validateRequest(storeIdParamValidator), validateRequest(storeInspectionQueryValidator), listStoreInventoryController);
router.get('/stores/:storeId/audit', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_AUDIT), validateRequest(storeIdParamValidator), validateRequest(storeInspectionQueryValidator), listStoreAuditController);
router.get('/stores/:storeId', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_READ), validateRequest(storeIdParamValidator), getStoreController);
router.patch('/stores/:storeId/status', requireAnyPermission(VENDOR_STORE_MANAGEMENT_PERMISSION_GROUPS.STORE_STATUS), validateRequest(storeIdParamValidator), validateRequest(updateStoreStatusValidator), updateStoreStatusController);

export default router;
