import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import { getCustomerHomeController } from '../controllers/customer-home.controller';
import { customerHomeQueryValidator } from '../validators/customer-home.validators';

const router = Router();

router.get(
  '/',
  validateRequest({ query: customerHomeQueryValidator }),
  getCustomerHomeController,
);

export default router;
