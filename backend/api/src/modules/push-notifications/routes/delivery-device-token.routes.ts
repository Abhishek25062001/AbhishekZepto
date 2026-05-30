import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  registerDeliveryDeviceTokenController,
  removeDeviceTokenController,
} from '../controllers/device-token.controller';
import {
  registerDeliveryDeviceTokenBodyValidator,
  removeDeliveryDeviceTokenParamsValidator,
} from '../validators/device-token.validator';

const router = Router();

router.post(
  '/',
  validateRequest({ body: registerDeliveryDeviceTokenBodyValidator }),
  registerDeliveryDeviceTokenController,
);

router.delete(
  '/:deviceId',
  validateRequest({ params: removeDeliveryDeviceTokenParamsValidator }),
  removeDeviceTokenController,
);

export default router;
