import { Router } from 'express';
import { validateRequest } from '../../../middlewares/validate-request.middleware';
import {
  getOwnProfileController,
  updateOwnProfileController,
  updateOwnAvailabilityController,
  getOwnAvailabilityStatusController,
} from '../controllers/delivery-agent.controller';
import {
  updateProfileBodySchema,
  updateAvailabilityBodySchema,
} from '../validators/delivery-agent.validators';
import { authenticateDeliveryAgent } from '../middlewares/delivery-agent-auth.middleware';
import {
  agentArrivedAtStoreController,
  agentPickedUpController,
  agentEnRouteToCustomerController,
  agentArrivedAtCustomerController,
  agentDeliveredController,
  agentFailedController,
} from '../controllers/delivery-assignment.controller';
import {
  assignmentParamSchema,
  pickedUpBodySchema,
  deliveredBodySchema,
  failedBodySchema,
} from '../validators/delivery-assignment.validators';


const router = Router();

// ---------------------------------------------------------------------------
// GET /profile — Returns the authenticated delivery agent's own profile.
// ---------------------------------------------------------------------------

router.get(
  '/profile',
  authenticateDeliveryAgent(),
  getOwnProfileController,
);

// ---------------------------------------------------------------------------
// PATCH /profile — Updates the authenticated delivery agent's own profile.
// ---------------------------------------------------------------------------

router.patch(
  '/profile',
  authenticateDeliveryAgent(),
  validateRequest({ body: updateProfileBodySchema }),
  updateOwnProfileController,
);

// ---------------------------------------------------------------------------
// PATCH /availability — Updates the authenticated delivery agent's availability status.
// ---------------------------------------------------------------------------

router.patch(
  '/availability',
  authenticateDeliveryAgent(),
  validateRequest({ body: updateAvailabilityBodySchema }),
  updateOwnAvailabilityController,
);

// ---------------------------------------------------------------------------
// GET /status — Retrieves a lightweight presence status payload.
// ---------------------------------------------------------------------------

router.get(
  '/status',
  authenticateDeliveryAgent(),
  getOwnAvailabilityStatusController,
);

// ---------------------------------------------------------------------------
// POST /assignments/:assignmentId/arrived-at-store — Mark arrival at store.
// ---------------------------------------------------------------------------
router.post(
  '/assignments/:assignmentId/arrived-at-store',
  authenticateDeliveryAgent(),
  validateRequest({ params: assignmentParamSchema }),
  agentArrivedAtStoreController,
);

// ---------------------------------------------------------------------------
// POST /assignments/:assignmentId/picked-up — Mark order goods picked up.
// ---------------------------------------------------------------------------
router.post(
  '/assignments/:assignmentId/picked-up',
  authenticateDeliveryAgent(),
  validateRequest({ params: assignmentParamSchema, body: pickedUpBodySchema }),
  agentPickedUpController,
);

// ---------------------------------------------------------------------------
// POST /assignments/:assignmentId/en-route-to-customer — Mark en-route to customer.
// ---------------------------------------------------------------------------
router.post(
  '/assignments/:assignmentId/en-route-to-customer',
  authenticateDeliveryAgent(),
  validateRequest({ params: assignmentParamSchema }),
  agentEnRouteToCustomerController,
);

// ---------------------------------------------------------------------------
// POST /assignments/:assignmentId/arrived-at-customer — Mark arrived at customer.
// ---------------------------------------------------------------------------
router.post(
  '/assignments/:assignmentId/arrived-at-customer',
  authenticateDeliveryAgent(),
  validateRequest({ params: assignmentParamSchema }),
  agentArrivedAtCustomerController,
);

// ---------------------------------------------------------------------------
// POST /assignments/:assignmentId/delivered — Mark assignment as delivered.
// ---------------------------------------------------------------------------
router.post(
  '/assignments/:assignmentId/delivered',
  authenticateDeliveryAgent(),
  validateRequest({ params: assignmentParamSchema, body: deliveredBodySchema }),
  agentDeliveredController,
);

// ---------------------------------------------------------------------------
// POST /assignments/:assignmentId/failed — Mark assignment as failed.
// ---------------------------------------------------------------------------
router.post(
  '/assignments/:assignmentId/failed',
  authenticateDeliveryAgent(),
  validateRequest({ params: assignmentParamSchema, body: failedBodySchema }),
  agentFailedController,
);


export default router;
