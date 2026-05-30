import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  registerCustomerDeviceTokenController,
  removeDeviceTokenController,
} from '../controllers/device-token.controller';
import {
  registerCustomerDeviceTokenBodyValidator,
  removeCustomerDeviceTokenParamsValidator,
} from '../validators/device-token.validator';

const router = Router();

router.post(
  '/',
  validateRequest({ body: registerCustomerDeviceTokenBodyValidator }),
  registerCustomerDeviceTokenController,
);

router.delete(
  '/:deviceId',
  validateRequest({ params: removeCustomerDeviceTokenParamsValidator }),
  removeDeviceTokenController,
);

export default router;
