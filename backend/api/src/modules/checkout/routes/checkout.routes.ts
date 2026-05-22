import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  cancelCheckoutController,
  getCheckoutSummaryController,
  initiateCheckoutController,
} from '../controllers/checkout.controller';
import {
  cancelCheckoutBodyValidator,
  getCheckoutSummaryQueryValidator,
  initiateCheckoutBodyValidator,
} from '../validators/checkout.validators';

const router = Router();

router.post(
  '/initiate',
  validateRequest({ body: initiateCheckoutBodyValidator }),
  initiateCheckoutController,
);

router.get(
  '/summary',
  validateRequest({ query: getCheckoutSummaryQueryValidator }),
  getCheckoutSummaryController,
);

router.post(
  '/cancel',
  validateRequest({ body: cancelCheckoutBodyValidator }),
  cancelCheckoutController,
);

export default router;
