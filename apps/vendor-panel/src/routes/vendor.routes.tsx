import { Navigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { DebugPage } from '../pages/debug/DebugPage';
import { InventoryPage } from '../pages/inventory/InventoryPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { isDevelopment } from '../config/env';
import { ProtectedRoute } from './ProtectedRoute';

export const vendorRoutes = [
  {
    path: '/login',
    element: <LoginPage />,
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
        element: <DashboardPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />,
      },
      {
        path: '/inventory',
        element: <InventoryPage />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      ...(isDevelopment
        ? [
            {
              path: '/debug',
              element: <DebugPage />,
            },
          ]
        : []),
    ],
  },
];
