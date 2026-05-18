import { Navigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { OtpVerificationPage } from '../pages/auth/OtpVerificationPage';
import { CanAccess } from '../components/auth/CanAccess';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AuthSmokeTestPage } from '../pages/debug/AuthSmokeTestPage';
import { DebugPage } from '../pages/debug/DebugPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { SessionsPage } from '../pages/settings/SessionsPage';
import { isDevelopment } from '../config/env';
import { ProtectedRoute } from './ProtectedRoute';
import { storeCatalogRoutes } from './store-catalog.routes';
import { storeInventoryRoutes } from './store-inventory.routes';
import { VendorMediaListPage } from '../modules/media/pages/VendorMediaListPage';

export const vendorRoutes = [
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
          <CanAccess fallback={<Navigate to="/orders" replace />} permission="vendor:read_store">
            <DashboardPage />
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
        path: '/products',
        element: <Navigate replace to="/store-catalog/products" />,
      },
      ...storeCatalogRoutes,
      ...storeInventoryRoutes,
      {
        path: '/media',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="catalog:read">
            <VendorMediaListPage />
          </CanAccess>
        ),
      },
      {
        path: '/settings',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="settings:manage">
            <SettingsPage />
          </CanAccess>
        ),
      },
      {
        path: '/settings/sessions',
        element: (
          <CanAccess fallback={<Navigate to="/dashboard" replace />} permission="settings:manage">
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
