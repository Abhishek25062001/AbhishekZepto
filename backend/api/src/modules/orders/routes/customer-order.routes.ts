import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  cancelCustomerOrderController,
  getCustomerOrderDeliveryController,
  getCustomerOrderLifecycleController,
  getCustomerOrderStateController,
  getOrderController,
  listOrdersController,
  placeOrderController,
} from '../controllers/order.controller';
import {
  listOrdersQueryValidator,
  cancelOrderBodyValidator,
  orderIdParamValidator,
  placeOrderBodyValidator,
} from '../validators/order.validators';

const router = Router();

router.post('/', validateRequest({ body: placeOrderBodyValidator }), placeOrderController);

router.get('/', validateRequest({ query: listOrdersQueryValidator }), listOrdersController);

router.get(
  '/:orderId/state',
  validateRequest({ params: orderIdParamValidator }),
  getCustomerOrderStateController,
);

router.get(
  '/:orderId/lifecycle',
  validateRequest({ params: orderIdParamValidator }),
  getCustomerOrderLifecycleController,
);

router.get(
  '/:orderId/delivery',
  validateRequest({ params: orderIdParamValidator }),
  getCustomerOrderDeliveryController,
);

router.get(
  '/:orderId',
  validateRequest({ params: orderIdParamValidator }),
  getOrderController,
);

router.post(
  '/:orderId/cancel',
  validateRequest({
    body: cancelOrderBodyValidator,
    params: orderIdParamValidator,
  }),
  cancelCustomerOrderController,
);

export default router;
