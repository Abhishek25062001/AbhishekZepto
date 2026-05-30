import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  manualDispatchController,
  listPendingDeliveriesController,
  listAdminDeliveriesController,
  getAdminDeliveryDetailController,
  adminOverrideDeliveryController,
} from '../controllers/delivery-assignment.controller';
import {
  dispatchParamSchema,
  pendingListQuerySchema,
  adminDeliveryListQuerySchema,
  deliveryIdParamSchema,
  adminOverrideBodySchema,
} from '../validators/delivery-assignment.validators';

const router = Router();

// ---------------------------------------------------------------------------
// GET /pending — List all pending unassigned deliveries (admin).
// IMPORTANT: This route must be registered BEFORE /:deliveryId to prevent
// Express treating "pending" as a deliveryId param value.
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

// ---------------------------------------------------------------------------
// Module 15 — Admin Delivery Operations
// ---------------------------------------------------------------------------

// GET / — List all delivery assignments with filters (delivery:monitor).
router.get(
  '/',
  validateRequest({ query: adminDeliveryListQuerySchema }),
  listAdminDeliveriesController,
);

// GET /:deliveryId — Get full delivery detail + timeline (delivery:read).
router.get(
  '/:deliveryId',
  validateRequest({ params: deliveryIdParamSchema }),
  getAdminDeliveryDetailController,
);

// POST /:deliveryId/override — Admin state override (delivery:update).
router.post(
  '/:deliveryId/override',
  validateRequest({ params: deliveryIdParamSchema, body: adminOverrideBodySchema }),
  adminOverrideDeliveryController,
);

export default router;
