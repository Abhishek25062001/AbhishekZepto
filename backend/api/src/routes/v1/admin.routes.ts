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
import adminRealtimeRoutes from '../../modules/realtime/routes/admin-realtime.routes';
import adminControlRoutes from '../../modules/admin-control/routes/admin-control.routes';
import adminUserManagementRoutes from '../../modules/admin-users/routes/admin-user.routes';
import customerManagementRoutes from '../../modules/customer-management/routes/customer-management.routes';
import deliveryAgentManagementRoutes from '../../modules/delivery-agent-management/routes/admin-delivery-agent.routes';
import vendorStoreManagementRoutes from '../../modules/vendor-store-management/routes/admin-vendor-store.routes';
import supportOperationsRoutes from '../../modules/support-operations/routes/support-operations.routes';
import platformSettingsRoutes from '../../modules/platform-settings/routes/platform-settings.routes';
import auditLogSystemRoutes from '../../modules/audit-log-system/routes/audit-log-system.routes';
import operationalAnalyticsRoutes from '../../modules/operational-analytics/routes/operational-analytics.routes';
import adminDataExportRoutes from '../../modules/admin-data-exports/routes/admin-data-export.routes';
import paymentAdminRoutes from '../../modules/payment/routes/payment-admin.routes';
import { ledgerAdminRoutes } from '../../modules/finance/ledger';
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
router.use('/users', authenticate(), requireRole(adminRoles), adminUserManagementRoutes);
router.use('/customers', authenticate(), requireRole(adminRoles), customerManagementRoutes);
router.use('/delivery-agents', authenticate(), requireRole(adminRoles), deliveryAgentManagementRoutes);
router.use('/support', authenticate(), requireRole(adminRoles), supportOperationsRoutes);
router.use('/settings', authenticate(), requireRole(adminRoles), platformSettingsRoutes);
router.use('/audit-logs', authenticate(), requireRole(adminRoles), auditLogSystemRoutes);
router.use('/analytics', authenticate(), requireRole(adminRoles), operationalAnalyticsRoutes);
router.use('/data-exports', authenticate(), requireRole(adminRoles), adminDataExportRoutes);
router.use('/', authenticate(), requireRole(adminRoles), vendorStoreManagementRoutes);
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

router.use(
  '/realtime',
  authenticate(),
  requireRole(adminRoles),
  adminRealtimeRoutes,
);

router.use(
  '/control',
  authenticate(),
  requireRole(adminRoles),
  adminControlRoutes,
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

router.use(
  '/finance/payments',
  authenticate(),
  requireRole(adminRoles),
  paymentAdminRoutes,
);

router.use(
  '/finance/ledger',
  authenticate(),
  requireRole(adminRoles),
  ledgerAdminRoutes,
);

router.get('/', (_req, res) => {
  return sendSuccessResponse({
    res,
    message: 'Admin API route group ready',
    data: {},
  });
});

export default router;
