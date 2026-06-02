import { Navigate } from 'react-router-dom';

import { CanAccess } from '../components/auth/CanAccess';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { OtpVerificationPage } from '../pages/auth/OtpVerificationPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AuthSmokeTestPage } from '../pages/debug/AuthSmokeTestPage';
import { DebugPage } from '../pages/debug/DebugPage';
import { DeliveryAgentDetailPage } from '../pages/delivery-agents/DeliveryAgentDetailPage';
import { DeliveryAgentsPage } from '../pages/delivery-agents/DeliveryAgentsPage';
import { DeliveriesPage } from '../pages/deliveries/DeliveriesPage';
import { DeliveryDetailPage } from '../pages/deliveries/DeliveryDetailPage';
import { FinancePage } from '../pages/finance/FinancePage';
import { OperationalOverviewPage } from '../pages/analytics/OperationalOverviewPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { AuditLogsPage } from '../pages/audit-logs/AuditLogsPage';
import { AdminOrderDetailPage } from '../modules/orders/pages/AdminOrderDetailPage';
import { AuditLogDetailPage } from '../modules/audit-logs/pages/AuditLogDetailPage';
import { DataExportDetailPage } from '../modules/data-exports/pages/DataExportDetailPage';
import { DataExportListPage } from '../modules/data-exports/pages/DataExportListPage';
import { RealtimeControlTowerPage } from '../modules/realtime-control-tower/pages/RealtimeControlTowerPage';
import { catalogRoutes } from './catalog.routes';
import { inventoryRoutes } from './inventory.routes';
import { storeRoutes } from './store.routes';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { PlatformSettingsPage } from '../pages/settings/PlatformSettingsPage';
import { PlatformSettingDetailPage } from '../modules/platform-settings/pages/PlatformSettingDetailPage';
import { SessionsPage } from '../pages/settings/SessionsPage';
import { AdminUserDetailPage } from '../pages/users/AdminUserDetailPage';
import { UserSessionsPage } from '../pages/users/UserSessionsPage';
import { CanAccessAny } from '../components/auth/CanAccessAny';
import { SupportPage } from '../pages/support/SupportPage';
import { SupportTicketDetailPage } from '../modules/support/pages/SupportTicketDetailPage';
import { UsersPage } from '../pages/users/UsersPage';
import { VendorDetailPage } from '../pages/vendors/VendorDetailPage';
import { VendorsPage } from '../pages/vendors/VendorsPage';
import { isDevelopment } from '../config/env';
import { ProtectedRoute } from './ProtectedRoute';
import { NotificationCenterPage } from '../modules/notification-center/pages/NotificationCenterPage';

export const adminRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/otp-verification',
    element: <OtpVerificationPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: (
          <CanAccess fallback={<Navigate to="/orders" replace />} permission="auth:read">
            <DashboardPage />
          </CanAccess>
        ),
      },
      {
        path: '/notifications',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="notifications:read_self">
            <NotificationCenterPage />
          </CanAccess>
        ),
      },
      {
        path: '/users',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="users:read">
            <UsersPage />
          </CanAccess>
        ),
      },
      {
        path: '/users/:adminUserId',
        element: (
          <CanAccess fallback={<Navigate to="/users" replace />} permission="users:read">
            <AdminUserDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/users/:userId/sessions',
        element: (
          <CanAccessAny
            fallback={<Navigate to="/users" replace />}
            permissions={['auth:read', 'users:read', 'settings:manage']}
          >
            <UserSessionsPage />
          </CanAccessAny>
        ),
      },
      {
        path: '/products',
        element: <Navigate replace to="/catalog/products" />,
      },
      ...catalogRoutes,
      ...storeRoutes,
      ...inventoryRoutes,
      {
        path: '/audit-logs/:auditLogId',
        element: (
          <CanAccess fallback={<Navigate to="/audit-logs" replace />} permission="audit_logs:read">
            <AuditLogDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/audit-logs',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="audit_logs:read">
            <AuditLogsPage />
          </CanAccess>
        ),
      },
      {
        path: '/orders/:orderId',
        element: (
          <CanAccess fallback={<Navigate to="/orders" replace />} permission="orders:read">
            <AdminOrderDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/orders',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="orders:read">
            <OrdersPage />
          </CanAccess>
        ),
      },
      {
        path: '/vendors/:vendorId',
        element: (
          <CanAccess fallback={<Navigate to="/vendors" replace />} permission="stores:read">
            <VendorDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/vendors',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="stores:read">
            <VendorsPage />
          </CanAccess>
        ),
      },
      {
        path: '/delivery-agents/:deliveryAgentId',
        element: (
          <CanAccess fallback={<Navigate to="/delivery-agents" replace />} permission="delivery:read">
            <DeliveryAgentDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/delivery-agents',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="delivery:read">
            <DeliveryAgentsPage />
          </CanAccess>
        ),
      },
      {
        path: '/realtime-control-tower',
        element: (
          <CanAccess
            fallback={<Navigate to="/dashboard" replace />}
            permission="realtime_control_tower:read"
          >
            <RealtimeControlTowerPage />
          </CanAccess>
        ),
      },
      // Module 15 — Admin Delivery Operations
      {
        path: '/deliveries',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="delivery:monitor">
            <DeliveriesPage />
          </CanAccess>
        ),
      },
      {
        path: '/deliveries/:deliveryId',
        element: (
          <CanAccess fallback={<Navigate to="/deliveries" replace />} permission="delivery:read">
            <DeliveryDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/finance',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="finance:read">
            <FinancePage />
          </CanAccess>
        ),
      },
      {
        path: '/analytics',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="reports:read">
            <OperationalOverviewPage />
          </CanAccess>
        ),
      },
      {
        path: '/exports/:exportId',
        element: (
          <CanAccess fallback={<Navigate to="/exports" replace />} permission="reports:export">
            <DataExportDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/exports',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="reports:export">
            <DataExportListPage />
          </CanAccess>
        ),
      },
      {
        path: '/support/tickets/:ticketId',
        element: (
          <CanAccess fallback={<Navigate to="/support" replace />} permission="support:read">
            <SupportTicketDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/support',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="support:read">
            <SupportPage />
          </CanAccess>
        ),
      },
      {
        path: '/settings/platform/:settingKey',
        element: (
          <CanAccess fallback={<Navigate to="/settings/platform" replace />} permission="settings:read">
            <PlatformSettingDetailPage />
          </CanAccess>
        ),
      },
      {
        path: '/settings/platform',
        element: (
          <CanAccess fallback={<Navigate to="/settings" replace />} permission="settings:read">
            <PlatformSettingsPage />
          </CanAccess>
        ),
      },
      {
        path: '/settings',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="settings:read">
            <SettingsPage />
          </CanAccess>
        ),
      },
      {
        path: '/settings/sessions',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="settings:read">
            <SessionsPage />
          </CanAccess>
        ),
      },
      ...(isDevelopment
        ? [
            {
              path: '/debug',
              element: <DebugPage />,
            },
            {
              path: '/debug/auth-smoke',
              element: <AuthSmokeTestPage />,
            },
          ]
        : []),
    ],
  },
];
