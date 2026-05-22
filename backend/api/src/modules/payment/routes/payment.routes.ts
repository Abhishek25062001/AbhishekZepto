import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  createPaymentOrderController,
  verifyPaymentController,
} from '../controllers/payment.controller';
import {
  createPaymentOrderBodyValidator,
  verifyPaymentBodyValidator,
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

export default router;
