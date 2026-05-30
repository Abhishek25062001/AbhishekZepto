import { Navigate } from 'react-router-dom';

import { CanAccess } from '../components/auth/CanAccess';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { OtpVerificationPage } from '../pages/auth/OtpVerificationPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AuthSmokeTestPage } from '../pages/debug/AuthSmokeTestPage';
import { DebugPage } from '../pages/debug/DebugPage';
import { DeliveryAgentsPage } from '../pages/delivery-agents/DeliveryAgentsPage';
import { DeliveriesPage } from '../pages/deliveries/DeliveriesPage';
import { DeliveryDetailPage } from '../pages/deliveries/DeliveryDetailPage';
import { FinancePage } from '../pages/finance/FinancePage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { AdminOrderDetailPage } from '../modules/orders/pages/AdminOrderDetailPage';
import { RealtimeControlTowerPage } from '../modules/realtime-control-tower/pages/RealtimeControlTowerPage';
import { catalogRoutes } from './catalog.routes';
import { inventoryRoutes } from './inventory.routes';
import { storeRoutes } from './store.routes';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { SessionsPage } from '../pages/settings/SessionsPage';
import { UserSessionsPage } from '../pages/users/UserSessionsPage';
import { CanAccessAny } from '../components/auth/CanAccessAny';
import { SupportPage } from '../pages/support/SupportPage';
import { UsersPage } from '../pages/users/UsersPage';
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
        path: '/support',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="support:read">
            <SupportPage />
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
