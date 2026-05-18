import { Navigate } from 'react-router-dom';

import { CanAccess } from '../components/auth/CanAccess';
import { VendorInventoryAdjustmentPage } from '../modules/store-inventory/pages/VendorInventoryAdjustmentPage';
import { VendorInventoryMovementListPage } from '../modules/store-inventory/pages/VendorInventoryMovementListPage';
import { VendorInventoryStockDetailPage } from '../modules/store-inventory/pages/VendorInventoryStockDetailPage';
import { VendorInventoryStockListPage } from '../modules/store-inventory/pages/VendorInventoryStockListPage';

const inventoryFallback = <Navigate replace to="/dashboard" />;

export const storeInventoryRoutes = [
  {
    path: '/inventory',
    element: <Navigate replace to="/inventory/stocks" />,
  },
  {
    path: '/inventory/stocks',
    element: (
      <CanAccess fallback={inventoryFallback} permission="inventory:read">
        <VendorInventoryStockListPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/stocks/:inventoryStockId',
    element: (
      <CanAccess fallback={inventoryFallback} permission="inventory:read">
        <VendorInventoryStockDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/stocks/:inventoryStockId/adjust',
    element: (
      <CanAccess fallback={inventoryFallback} permission="inventory:update">
        <VendorInventoryAdjustmentPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/movements',
    element: (
      <CanAccess fallback={inventoryFallback} permission="inventory:read">
        <VendorInventoryMovementListPage />
      </CanAccess>
    ),
  },
];
