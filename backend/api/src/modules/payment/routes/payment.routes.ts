import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  createPaymentOrderController,
  getCustomerPaymentByIdController,
  verifyPaymentByIdController,
  verifyPaymentController,
} from '../controllers/payment.controller';
import {
  createPaymentOrderBodyValidator,
  paymentIdParamsValidator,
  verifyPaymentBodyValidator,
  verifyPaymentByIdBodyValidator,
} from '../validators/payment.validators';

const router = Router();

router.post(
  '/create-order',
  validateRequest({ body: createPaymentOrderBodyValidator }),
  createPaymentOrderController,
);

router.post(
  '/verify',
  validateRequest({ body: verifyPaymentBodyValidator }),
  verifyPaymentController,
);

router.post(
  '/:paymentId/verify',
  validateRequest({
    params: paymentIdParamsValidator,
    body: verifyPaymentByIdBodyValidator,
  }),
  verifyPaymentByIdController,
);

router.get(
  '/:paymentId',
  validateRequest({ params: paymentIdParamsValidator }),
  getCustomerPaymentByIdController,
);

export default router;
