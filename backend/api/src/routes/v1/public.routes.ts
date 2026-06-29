import { Router } from 'express';
import authRoutes from '../../modules/auth/routes/auth.routes';
import publicSystemRoutes from '../../modules/system/routes/public-system.routes';
import { razorpayWebhookController } from '../../modules/payment/controllers/payment-webhook.controller';
import { razorpayWebhookSignatureMiddleware } from '../../modules/payment/middlewares/razorpay-webhook-signature.middleware';
import { razorpayWebhookBodyValidator } from '../../modules/payment/validators/payment.validators';
import { validateRequest } from '../../middlewares/validate-request.middleware';
import docsRoutes, { shouldExposeApiDocs } from './docs.routes';

const router = Router();

if (shouldExposeApiDocs) {
  router.use('/', docsRoutes);
}

router.use('/auth', authRoutes);
router.post(
  '/webhooks/payments/razorpay',
  razorpayWebhookSignatureMiddleware,
  validateRequest({ body: razorpayWebhookBodyValidator }),
  razorpayWebhookController,
);
router.use('/', publicSystemRoutes);

export default router;
