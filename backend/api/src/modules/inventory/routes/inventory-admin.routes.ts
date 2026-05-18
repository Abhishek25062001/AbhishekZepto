import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { AUTH_PERMISSION_ACTION, AUTH_PERMISSION_RESOURCE } from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  adjustInventoryStockController,
  bulkUpdateInventoryThresholdsController,
  bulkUploadInventoryStocksController,
  createInventoryStockController,
  deleteInventoryStockController,
  getInventoryStockByIdController,
  listInventoryStocksController,
  updateInventoryStockController,
} from '../controllers/inventory-stock.controller';
import inventoryLockAdminRoutes from '../locks/routes/inventory-lock-admin.routes';
import {
  getInventoryMovementByIdController,
  listInventoryMovementsController,
} from '../movements/controllers/inventory-movement.controller';
import {
  adminInventoryAdjustBodyValidator,
  bulkThresholdInventoryBodyValidator,
  bulkUploadInventoryBodyValidator,
  createInventoryStockBodyValidator,
  inventoryMovementIdParamsValidator,
  inventoryStockIdParamsValidator,
  listInventoryMovementsQueryValidator,
  listInventoryStocksQueryValidator,
  updateInventoryStockBodyValidator,
} from '../validators/inventory-stock.validators';

const router = Router();

const inventoryRead = createPermissionCode(AUTH_PERMISSION_RESOURCE.INVENTORY, AUTH_PERMISSION_ACTION.READ);
const inventoryCreate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.INVENTORY,
  AUTH_PERMISSION_ACTION.CREATE,
);
const inventoryUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.INVENTORY,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const inventoryDelete = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.INVENTORY,
  AUTH_PERMISSION_ACTION.DELETE,
);
const inventoryAdjust = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.INVENTORY,
  AUTH_PERMISSION_ACTION.ADJUST,
);
const inventoryBulkUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.INVENTORY,
  AUTH_PERMISSION_ACTION.BULK_UPDATE,
);

router.post(
  '/stocks',
  requirePermission(inventoryCreate),
  validateRequest({ body: createInventoryStockBodyValidator }),
  createInventoryStockController,
);

router.get(
  '/stocks',
  requirePermission(inventoryRead),
  validateRequest({ query: listInventoryStocksQueryValidator }),
  listInventoryStocksController,
);

router.post(
  '/stocks/bulk-upload',
  requirePermission(inventoryBulkUpdate),
  validateRequest({ body: bulkUploadInventoryBodyValidator }),
  bulkUploadInventoryStocksController,
);

router.patch(
  '/stocks/bulk-thresholds',
  requirePermission(inventoryBulkUpdate),
  validateRequest({ body: bulkThresholdInventoryBodyValidator }),
  bulkUpdateInventoryThresholdsController,
);

router.use('/locks', inventoryLockAdminRoutes);

router.get(
  '/movements',
  requirePermission(inventoryRead),
  validateRequest({ query: listInventoryMovementsQueryValidator }),
  listInventoryMovementsController,
);

router.get(
  '/movements/:movementId',
  requirePermission(inventoryRead),
  validateRequest({ params: inventoryMovementIdParamsValidator }),
  getInventoryMovementByIdController,
);

router.get(
  '/stocks/:inventoryStockId',
  requirePermission(inventoryRead),
  validateRequest({ params: inventoryStockIdParamsValidator }),
  getInventoryStockByIdController,
);

router.patch(
  '/stocks/:inventoryStockId',
  requirePermission(inventoryUpdate),
  validateRequest({ params: inventoryStockIdParamsValidator }),
  validateRequest({ body: updateInventoryStockBodyValidator }),
  updateInventoryStockController,
);

router.delete(
  '/stocks/:inventoryStockId',
  requirePermission(inventoryDelete),
  validateRequest({ params: inventoryStockIdParamsValidator }),
  deleteInventoryStockController,
);

router.post(
  '/stocks/:inventoryStockId/adjust',
  requirePermission(inventoryAdjust),
  validateRequest({ params: inventoryStockIdParamsValidator }),
  validateRequest({ body: adminInventoryAdjustBodyValidator }),
  adjustInventoryStockController,
);

export default router;
