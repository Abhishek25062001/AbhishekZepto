import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  adjustVendorInventoryStockController,
  getVendorInventoryStockByIdController,
  listVendorInventoryMovementsController,
  listVendorInventoryStocksController,
} from '../controllers/inventory-vendor.controller';
import {
  inventoryStockIdParamsValidator,
  listInventoryMovementsQueryValidator,
  listInventoryStocksQueryValidator,
  vendorInventoryAdjustBodyValidator,
} from '../validators/inventory-stock.validators';

const router = Router();

const inventoryRead = createPermissionCode(AUTH_PERMISSION_RESOURCE.INVENTORY, AUTH_PERMISSION_ACTION.READ);
const inventoryUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.INVENTORY,
  AUTH_PERMISSION_ACTION.UPDATE,
);

router.get(
  '/stocks',
  requirePermission(inventoryRead),
  validateRequest({ query: listInventoryStocksQueryValidator }),
  listVendorInventoryStocksController,
);

router.get(
  '/stocks/:inventoryStockId',
  requirePermission(inventoryRead),
  validateRequest({ params: inventoryStockIdParamsValidator }),
  getVendorInventoryStockByIdController,
);

router.post(
  '/stocks/:inventoryStockId/adjust',
  requirePermission(inventoryUpdate),
  validateRequest({ params: inventoryStockIdParamsValidator }),
  validateRequest({ body: vendorInventoryAdjustBodyValidator }),
  adjustVendorInventoryStockController,
);

router.get(
  '/movements',
  requirePermission(inventoryRead),
  validateRequest({ query: listInventoryMovementsQueryValidator }),
  listVendorInventoryMovementsController,
);

export default router;
