import { Navigate } from 'react-router-dom';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { DebugPage } from '../pages/debug/DebugPage';
import { DeliveryAgentsPage } from '../pages/delivery-agents/DeliveryAgentsPage';
import { FinancePage } from '../pages/finance/FinancePage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { StoresPage } from '../pages/stores/StoresPage';
import { SupportPage } from '../pages/support/SupportPage';
import { UsersPage } from '../pages/users/UsersPage';
import { isDevelopment } from '../config/env';
import { ProtectedRoute } from './ProtectedRoute';

export const adminRoutes = [
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
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/stores',
        element: <StoresPage />,
      },
      {
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />,
      },
      {
        path: '/delivery-agents',
        element: <DeliveryAgentsPage />,
      },
      {
        path: '/finance',
        element: <FinancePage />,
      },
      {
        path: '/support',
        element: <SupportPage />,
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
