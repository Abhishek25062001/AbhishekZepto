import { Router } from 'express';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { authenticate } from '../../modules/auth/middlewares/authenticate.middleware';
import { requireRole } from '../../modules/auth/middlewares/require-role.middleware';
import { sendSuccessResponse } from '../../utils/api-response';
import deliveryAgentRoutes from '../../modules/delivery/routes/delivery-agent.routes';

const router = Router();

// ---------------------------------------------------------------------------
// Phase 6 Module 2 — Delivery Agent Profile Routes
// GET  /api/v1/delivery/profile
// PATCH /api/v1/delivery/profile
// Note: PATCH /api/v1/delivery/availability is Module 3 — not mounted here.
// ---------------------------------------------------------------------------
router.use('/', deliveryAgentRoutes);

router.get(
  '/me/permissions',
  authenticate(),
  requireRole([AUTH_ROLE.DELIVERY_AGENT]),
  (req, res) => {
    const user = req.user;

    return sendSuccessResponse({
      res,
      message: 'Delivery permissions fetched successfully',
      data: {
        userId: user?.userId ?? null,
        customerId: null,
        deliveryAgentId: user?.userId ?? null,
        role: user?.role ?? null,
        permissions: user?.permissions ?? [],
        vendorId: user?.vendorId ?? null,
        storeId: user?.storeId ?? null,
        cityId: user?.cityId ?? null,
      },
    });
  },
);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Delivery API route group ready',
    data: {},
  });
});

export default router;

