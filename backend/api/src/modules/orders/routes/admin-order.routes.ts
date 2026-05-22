import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  AUTH_PERMISSION_ACTION,
  AUTH_PERMISSION_RESOURCE,
} from '../../auth/constants/auth-permission.constants';
import { requirePermission } from '../../auth/middlewares/require-permission.middleware';
import { createPermissionCode } from '../../auth/utils/permission-code.util';
import {
  cancelAdminOrderController,
  getAdminOrderController,
  getAdminOrderTimelineController,
  listAdminOrdersController,
  updateAdminOrderStatusController,
} from '../controllers/order.controller';
import {
  adminOrderStatusUpdateBodyValidator,
  cancelOrderBodyValidator,
  listAdminOrdersQueryValidator,
  orderIdParamValidator,
} from '../validators/order.validators';

const router = Router();

const ordersCancel = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.ORDERS,
  AUTH_PERMISSION_ACTION.CANCEL,
);
const ordersRead = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.ORDERS,
  AUTH_PERMISSION_ACTION.READ,
);
const ordersUpdateStatus = createPermissionCode(
  AUTH_PERMISSION_RESOURCE.ORDERS,
  AUTH_PERMISSION_ACTION.UPDATE_STATUS,
);

router.get(
  '/',
  requirePermission(ordersRead),
  validateRequest({
    query: listAdminOrdersQueryValidator,
  }),
  listAdminOrdersController,
);

router.get(
  '/:orderId/timeline',
  requirePermission(ordersRead),
  validateRequest({
    params: orderIdParamValidator,
  }),
  getAdminOrderTimelineController,
);

router.get(
  '/:orderId',
  requirePermission(ordersRead),
  validateRequest({
    params: orderIdParamValidator,
  }),
  getAdminOrderController,
);

router.post(
  '/:orderId/status',
  requirePermission(ordersUpdateStatus),
  validateRequest({
    body: adminOrderStatusUpdateBodyValidator,
    params: orderIdParamValidator,
  }),
  updateAdminOrderStatusController,
);

router.post(
  '/:orderId/cancel',
  requirePermission(ordersCancel),
  validateRequest({
    body: cancelOrderBodyValidator,
    params: orderIdParamValidator,
  }),
  cancelAdminOrderController,
);

export default router;
