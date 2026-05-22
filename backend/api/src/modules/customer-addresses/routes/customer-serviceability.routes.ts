import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  checkServiceabilityController,
  selectStoreController,
} from '../controllers/customer-serviceability.controller';
import {
  serviceabilityBodyValidator,
  storeSelectionBodyValidator,
} from '../validators/customer-serviceability.validators';

const serviceabilityRouter = Router();

serviceabilityRouter.post(
  '/',
  validateRequest({ body: serviceabilityBodyValidator }),
  checkServiceabilityController,
);

export default serviceabilityRouter;

export const customerStoreSelectionRouter = Router();

customerStoreSelectionRouter.post(
  '/',
  validateRequest({ body: storeSelectionBodyValidator }),
  selectStoreController,
);
