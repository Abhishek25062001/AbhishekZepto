import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  getActiveDeliveryLocationsController,
  getControlTowerSnapshotController,
} from '../controllers/control-tower.controller';
import { controlTowerQueryValidator } from '../validators/control-tower.validators';

const router = Router();

router.get(
  '/snapshot',
  validateRequest({ query: controlTowerQueryValidator }),
  getControlTowerSnapshotController,
);

router.get(
  '/delivery-locations',
  validateRequest({ query: controlTowerQueryValidator }),
  getActiveDeliveryLocationsController,
);

export default router;
