import { Router } from 'express';

import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  healthEndpointValidator,
  systemInfoEndpointValidator,
  versionEndpointValidator,
} from '../../../validators/public.validators';
import {
  healthCheckController,
  systemInfoController,
  versionController,
} from '../controllers/public-system.controller';

const router = Router();

router.get('/health', validateRequest(healthEndpointValidator), healthCheckController);
router.get('/version', validateRequest(versionEndpointValidator), versionController);
router.get('/system-info', validateRequest(systemInfoEndpointValidator), systemInfoController);

export default router;
