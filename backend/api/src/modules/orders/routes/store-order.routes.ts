import { Router } from 'express';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  acceptStoreOrderController,
  cancelStoreOrderController,
  completeStoreOrderPackingController,
  completeStoreOrderPickingController,
  getStoreOrderController,
  getVendorOrderDeliveryStatusController,
  listStoreOrdersController,
  markStoreOrderItemMissingController,
  markStoreOrderItemPickedController,
  markStoreOrderReadyForPickupController,
  rejectStoreOrderController,
  startStoreOrderPackingController,
  startStoreOrderPickingController,
} from '../controllers/order.controller';
import {
  orderIdParamValidator,
  cancelOrderBodyValidator,
  listStoreOrdersQueryValidator,
  orderItemIdParamValidator,
  rejectStoreOrderBodyValidator,
  storeOrderItemPickingBodyValidator,
} from '../validators/order.validators';

const router = Router();

const ordersUpdate = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.ORDERS,
  AUTH_PERMISSION_ACTION.UPDATE,
);
const ordersRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.ORDERS,
  AUTH_PERMISSION_ACTION.READ,
);

router.get(
  '/',
  requirePermission(ordersRead),
  validateRequest({ query: listStoreOrdersQueryValidator }),
  listStoreOrdersController,
);

router.get(
  '/:orderId',
  requirePermission(ordersRead),
  validateRequest({ params: orderIdParamValidator }),
  getStoreOrderController,
);

router.get(
  '/:orderId/delivery-status',
  requirePermission(ordersRead),
  validateRequest({ params: orderIdParamValidator }),
  getVendorOrderDeliveryStatusController,
);

router.post(
  '/:orderId/accept',
  requirePermission(ordersUpdate),
  validateRequest({ params: orderIdParamValidator }),
  acceptStoreOrderController,
);

router.post(
  '/:orderId/reject',
  requirePermission(ordersUpdate),
  validateRequest({
    body: rejectStoreOrderBodyValidator,
    params: orderIdParamValidator,
  }),
  rejectStoreOrderController,
);

router.post(
  '/:orderId/picking/start',
  requirePermission(ordersUpdate),
  validateRequest({ params: orderIdParamValidator }),
  startStoreOrderPickingController,
);

router.post(
  '/:orderId/items/:itemId/picked',
  requirePermission(ordersUpdate),
  validateRequest({
    body: storeOrderItemPickingBodyValidator,
    params: orderItemIdParamValidator,
  }),
  markStoreOrderItemPickedController,
);

router.post(
  '/:orderId/items/:itemId/missing',
  requirePermission(ordersUpdate),
  validateRequest({
    body: storeOrderItemPickingBodyValidator,
    params: orderItemIdParamValidator,
  }),
  markStoreOrderItemMissingController,
);

router.post(
  '/:orderId/picking/complete',
  requirePermission(ordersUpdate),
  validateRequest({ params: orderIdParamValidator }),
  completeStoreOrderPickingController,
);

router.post(
  '/:orderId/packing/start',
  requirePermission(ordersUpdate),
  validateRequest({ params: orderIdParamValidator }),
  startStoreOrderPackingController,
);

router.post(
  '/:orderId/packing/complete',
  requirePermission(ordersUpdate),
  validateRequest({ params: orderIdParamValidator }),
  completeStoreOrderPackingController,
);

router.post(
  '/:orderId/ready-for-pickup',
  requirePermission(ordersUpdate),
  validateRequest({ params: orderIdParamValidator }),
  markStoreOrderReadyForPickupController,
);

router.post(
  '/:orderId/cancel',
  requirePermission(ordersUpdate),
  validateRequest({
    body: cancelOrderBodyValidator,
    params: orderIdParamValidator,
  }),
  cancelStoreOrderController,
);

export default router;
