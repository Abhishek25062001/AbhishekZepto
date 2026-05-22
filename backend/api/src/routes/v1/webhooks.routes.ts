import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate-request.middleware';
import { razorpayWebhookController } from '../../modules/payment/controllers/payment-webhook.controller';
import { razorpayWebhookSignatureMiddleware } from '../../modules/payment/middlewares/razorpay-webhook-signature.middleware';
import { razorpayWebhookBodyValidator } from '../../modules/payment/validators/payment.validators';

const router = Router();

router.post(
  '/razorpay',
  razorpayWebhookSignatureMiddleware,
  validateRequest({ body: razorpayWebhookBodyValidator }),
  razorpayWebhookController,
);

export default router;
