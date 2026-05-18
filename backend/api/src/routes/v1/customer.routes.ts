import { Router } from 'express';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { authenticate } from '../../modules/auth/middlewares/authenticate.middleware';
import { requireRole } from '../../modules/auth/middlewares/require-role.middleware';
import catalogSearchCustomerRoutes from '../../modules/catalog/search/routes/catalog-search-customer.routes';
import { sendSuccessResponse } from '../../utils/api-response';

const router = Router();

router.get(
  '/me/permissions',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  (req, res) => {
    const user = req.user;

    return sendSuccessResponse({
      res,
      message: 'Customer permissions fetched successfully',
      data: {
        userId: user?.userId ?? null,
        customerId: user?.userId ?? null,
        deliveryAgentId: null,
        role: user?.role ?? null,
        permissions: user?.permissions ?? [],
        vendorId: user?.vendorId ?? null,
        storeId: user?.storeId ?? null,
        cityId: user?.cityId ?? null,
      },
    });
  },
);

router.use(
  '/catalog',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  catalogSearchCustomerRoutes,
);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Customer API route group ready',
    data: {},
  });
});

export default router;
