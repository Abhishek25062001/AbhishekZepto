import { Router } from 'express';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { authenticate } from '../../modules/auth/middlewares/authenticate.middleware';
import { requireRole } from '../../modules/auth/middlewares/require-role.middleware';
import catalogSearchCustomerRoutes from '../../modules/catalog/search/routes/catalog-search-customer.routes';
import customerAddressRoutes from '../../modules/customer-addresses/routes/customer-address.routes';
import customerServiceabilityRoutes, {
  customerStoreSelectionRouter,
} from '../../modules/customer-addresses/routes/customer-serviceability.routes';
import cartRoutes from '../../modules/cart/routes/cart.routes';
import checkoutRoutes from '../../modules/checkout/routes/checkout.routes';
import paymentRoutes from '../../modules/payment/routes/payment.routes';
import customerOrderRoutes from '../../modules/orders/routes/customer-order.routes';
import customerHomeRoutes from '../../modules/home/routes/customer-home.routes';
import customerProfileRoutes from '../../modules/profile/routes/customer-profile.routes';
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

router.use(
  '/addresses',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  customerAddressRoutes,
);

router.use(
  '/serviceability',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  customerServiceabilityRoutes,
);

router.use(
  '/store-selection',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  customerStoreSelectionRouter,
);

router.use(
  '/home',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  customerHomeRoutes,
);

router.use(
  '/cart',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  cartRoutes,
);

router.use(
  '/checkout',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  checkoutRoutes,
);

router.use(
  '/payments',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  paymentRoutes,
);

router.use(
  '/orders',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  customerOrderRoutes,
);

router.use(
  '/profile',
  authenticate(),
  requireRole([AUTH_ROLE.CUSTOMER]),
  customerProfileRoutes,
);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Customer API route group ready',
    data: {},
  });
});

export default router;
