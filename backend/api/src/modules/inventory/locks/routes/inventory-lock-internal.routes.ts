import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { authenticate } from '../../../auth/middlewares/authenticate.middleware';
import {
  confirmInventoryLockController,
  createInventoryLockController,
  releaseInventoryLockController,
} from '../controllers/inventory-lock-internal.controller';
import {
  confirmInventoryLockBodyValidator,
  createInventoryLockBodyValidator,
  inventoryLockTokenParamsValidator,
  releaseInventoryLockBodyValidator,
} from '../validators/inventory-lock.validators';

const router = Router();

router.post(
  '/',
  authenticate(),
  validateRequest({ body: createInventoryLockBodyValidator }),
  createInventoryLockController,
);

router.post(
  '/:lockToken/release',
  authenticate(),
  validateRequest({ params: inventoryLockTokenParamsValidator }),
  validateRequest({ body: releaseInventoryLockBodyValidator }),
  releaseInventoryLockController,
);

router.post(
  '/:lockToken/confirm',
  authenticate(),
  validateRequest({ params: inventoryLockTokenParamsValidator }),
  validateRequest({ body: confirmInventoryLockBodyValidator }),
  confirmInventoryLockController,
);

export default router;
