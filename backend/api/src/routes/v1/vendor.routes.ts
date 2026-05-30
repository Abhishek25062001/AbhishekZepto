import { Router } from 'express';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import { authenticate } from '../../modules/auth/middlewares/authenticate.middleware';
import { requireRole } from '../../modules/auth/middlewares/require-role.middleware';
import catalogSearchVendorRoutes from '../../modules/catalog/search/routes/catalog-search-vendor.routes';
import storeProductVendorRoutes from '../../modules/store-products/routes/store-product-vendor.routes';
import inventoryVendorRoutes from '../../modules/inventory/routes/inventory-vendor.routes';
import mediaVendorRoutes from '../../modules/media/routes/media-vendor.routes';
import vendorNotificationRoutes from '../../modules/in-app-notifications/routes/vendor-notification.routes';
import { sendSuccessResponse } from '../../utils/api-response';

const router = Router();

const vendorRoles = [
  AUTH_ROLE.VENDOR_OWNER,
  AUTH_ROLE.STORE_MANAGER,
  AUTH_ROLE.STORE_STAFF,
] as const;

router.get(
  '/me/permissions',
  authenticate(),
  requireRole(vendorRoles),
  (req, res) => {
    const user = req.user;

    return sendSuccessResponse({
      res,
      message: 'Vendor permissions fetched successfully',
      data: {
        userId: user?.userId ?? null,
        vendorUserId: user?.userId ?? null,
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
  requireRole(vendorRoles),
  catalogSearchVendorRoutes,
);
router.use(
  '/store-products',
  authenticate(),
  requireRole(vendorRoles),
  storeProductVendorRoutes,
);
router.use(
  '/inventory',
  authenticate(),
  requireRole(vendorRoles),
  inventoryVendorRoutes,
);
router.use(
  '/media',
  authenticate(),
  requireRole(vendorRoles),
  mediaVendorRoutes,
);

router.use(
  '/me/notifications',
  authenticate(),
  requireRole(vendorRoles),
  vendorNotificationRoutes,
);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Vendor API route group ready',
    data: {},
  });
});

export default router;
