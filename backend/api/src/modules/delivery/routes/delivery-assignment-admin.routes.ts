import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  manualDispatchController,
  listPendingDeliveriesController,
} from '../controllers/delivery-assignment.controller';
import {
  dispatchParamSchema,
  pendingListQuerySchema,
} from '../validators/delivery-assignment.validators';

const router = Router();

// ---------------------------------------------------------------------------
// GET /pending — List all pending unassigned deliveries (admin).
// ---------------------------------------------------------------------------
router.get(
  '/pending',
  validateRequest({ query: pendingListQuerySchema }),
  listPendingDeliveriesController,
);

// ---------------------------------------------------------------------------
// POST /:deliveryId/dispatch — Manually trigger dispatch matching engine (admin).
// ---------------------------------------------------------------------------
router.post(
  '/:deliveryId/dispatch',
  validateRequest({ params: dispatchParamSchema }),
  manualDispatchController,
);

export default router;
