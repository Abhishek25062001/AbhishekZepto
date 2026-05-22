import { Router } from 'express';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { authenticate } from '../../modules/auth/middlewares/authenticate.middleware';
import { requireRole } from '../../modules/auth/middlewares/require-role.middleware';
import storeOrderRoutes from '../../modules/orders/routes/store-order.routes';
import { sendSuccessResponse } from '../../utils/api-response';

const router = Router();

const storeRoles = [
  AUTH_ROLE.VENDOR_OWNER,
  AUTH_ROLE.STORE_MANAGER,
  AUTH_ROLE.STORE_STAFF,
] as const;

router.use('/orders', authenticate(), requireRole(storeRoles), storeOrderRoutes);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Store API route group ready',
    data: {},
  });
});

export default router;
