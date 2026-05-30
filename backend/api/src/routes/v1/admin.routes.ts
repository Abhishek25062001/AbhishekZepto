import { Router } from 'express';
import { AUTH_ROLE } from '../../modules/auth/constants/auth-role.constants';
import roleAdminRoutes from '../../modules/auth/routes/role-admin.routes';
import userPermissionAdminRoutes from '../../modules/auth/routes/user-permission-admin.routes';
import userSessionAdminRoutes from '../../modules/auth/routes/user-session-admin.routes';
import brandAdminRoutes from '../../modules/catalog/brands/routes/brand-admin.routes';
import categoryAdminRoutes from '../../modules/catalog/categories/routes/category-admin.routes';
import productAdminRoutes from '../../modules/catalog/products/routes/product-admin.routes';
import productUnitAdminRoutes from '../../modules/catalog/units/routes/product-unit-admin.routes';
import cityAdminRoutes from '../../modules/locations/cities/routes/city-admin.routes';
import serviceAreaAdminRoutes from '../../modules/locations/service-areas/routes/service-area-admin.routes';
import storeAdminRoutes from '../../modules/stores/routes/store-admin.routes';
import storeProductAdminRoutes from '../../modules/store-products/routes/store-product-admin.routes';
import inventoryAdminRoutes from '../../modules/inventory/routes/inventory-admin.routes';
import mediaAdminRoutes from '../../modules/media/routes/media-admin.routes';
import adminOrderRoutes from '../../modules/orders/routes/admin-order.routes';
import controlTowerAdminRoutes from '../../modules/control-tower/routes/control-tower-admin.routes';
import pushNotificationAdminRoutes from '../../modules/push-notifications/routes/push-notification-admin.routes';
import adminNotificationRoutes from '../../modules/in-app-notifications/routes/admin-notification.routes';
import deliveryAgentAdminRoutes from '../../modules/delivery/routes/delivery-agent-admin.routes';
import deliveryAssignmentAdminRoutes from '../../modules/delivery/routes/delivery-assignment-admin.routes';
import { authenticate } from '../../modules/auth/middlewares/authenticate.middleware';
import { requireRole } from '../../modules/auth/middlewares/require-role.middleware';
import { sendSuccessResponse } from '../../utils/api-response';

const router = Router();
const adminRoles = [
  AUTH_ROLE.SUPER_ADMIN,
  AUTH_ROLE.SUPPORT_ADMIN,
  AUTH_ROLE.OPERATIONS_ADMIN,
] as const;

router.get(
  '/me/permissions',
  authenticate(),
  requireRole(adminRoles),
  (req, res) => {
    const user = req.user;

    return sendSuccessResponse({
      res,
      message: 'Admin permissions fetched successfully',
      data: {
        userId: user?.userId ?? null,
        adminId: user?.userId ?? null,
        role: user?.role ?? null,
        permissions: user?.permissions ?? [],
        vendorId: user?.vendorId ?? null,
        storeId: user?.storeId ?? null,
        cityId: user?.cityId ?? null,
      },
    });
  },
);

router.use('/roles', authenticate(), requireRole(adminRoles), roleAdminRoutes);
router.use('/users', authenticate(), requireRole(adminRoles), userPermissionAdminRoutes);
router.use('/users', authenticate(), requireRole(adminRoles), userSessionAdminRoutes);
router.use(
  '/catalog/categories',
  authenticate(),
  requireRole(adminRoles),
  categoryAdminRoutes,
);
router.use(
  '/catalog/brands',
  authenticate(),
  requireRole(adminRoles),
  brandAdminRoutes,
);
router.use(
  '/catalog/units',
  authenticate(),
  requireRole(adminRoles),
  productUnitAdminRoutes,
);
router.use(
  '/catalog/products',
  authenticate(),
  requireRole(adminRoles),
  productAdminRoutes,
);
router.use(
  '/locations/cities',
  authenticate(),
  requireRole(adminRoles),
  cityAdminRoutes,
);
router.use(
  '/locations/service-areas',
  authenticate(),
  requireRole(adminRoles),
  serviceAreaAdminRoutes,
);
router.use(
  '/stores',
  authenticate(),
  requireRole(adminRoles),
  storeAdminRoutes,
);
router.use(
  '/store-products',
  authenticate(),
  requireRole(adminRoles),
  storeProductAdminRoutes,
);
router.use(
  '/inventory',
  authenticate(),
  requireRole(adminRoles),
  inventoryAdminRoutes,
);
router.use(
  '/media',
  authenticate(),
  requireRole(adminRoles),
  mediaAdminRoutes,
);
router.use(
  '/orders',
  authenticate(),
  requireRole(adminRoles),
  adminOrderRoutes,
);

router.use(
  '/control-tower',
  authenticate(),
  requireRole(adminRoles),
  controlTowerAdminRoutes,
);

router.use(
  '/push-notifications',
  authenticate(),
  requireRole(adminRoles),
  pushNotificationAdminRoutes,
);

router.use(
  '/me/notifications',
  authenticate(),
  requireRole(adminRoles),
  adminNotificationRoutes,
);

// ---------------------------------------------------------------------------
// Phase 6 Module 2 — Delivery Agent Admin Routes
// GET  /api/v1/admin/agents
// GET  /api/v1/admin/agents/:agentId
// ---------------------------------------------------------------------------
router.use(
  '/agents',
  authenticate(),
  requireRole(adminRoles),
  deliveryAgentAdminRoutes,
);

// ---------------------------------------------------------------------------
// Phase 6 Module 4 — Delivery Assignment Admin Routes
// GET  /api/v1/admin/deliveries/pending
// POST /api/v1/admin/deliveries/:deliveryId/dispatch
// ---------------------------------------------------------------------------
router.use(
  '/deliveries',
  authenticate(),
  requireRole(adminRoles),
  deliveryAssignmentAdminRoutes,
);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Admin API route group ready',
    data: {},
  });
});

export default router;
