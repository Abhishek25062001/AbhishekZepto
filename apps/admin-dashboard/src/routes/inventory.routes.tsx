import { Navigate } from 'react-router-dom';

import { CanAccess } from '../components/auth/CanAccess';
import { InventoryLockDetailPage } from '../modules/inventory/pages/locks/InventoryLockDetailPage';
import { InventoryLockListPage } from '../modules/inventory/pages/locks/InventoryLockListPage';
import { InventoryMovementDetailPage } from '../modules/inventory/pages/movements/InventoryMovementDetailPage';
import { InventoryMovementListPage } from '../modules/inventory/pages/movements/InventoryMovementListPage';
import { StoreProductCreatePage } from '../modules/inventory/pages/store-products/StoreProductCreatePage';
import { StoreProductEditPage } from '../modules/inventory/pages/store-products/StoreProductEditPage';
import { StoreProductListPage } from '../modules/inventory/pages/store-products/StoreProductListPage';
import { InventoryStockCreatePage } from '../modules/inventory/pages/stocks/InventoryStockCreatePage';
import { InventoryStockDetailPage } from '../modules/inventory/pages/stocks/InventoryStockDetailPage';
import { InventoryStockEditPage } from '../modules/inventory/pages/stocks/InventoryStockEditPage';
import { InventoryStockListPage } from '../modules/inventory/pages/stocks/InventoryStockListPage';

const storeProductsReadFallback = <Navigate replace to="/dashboard" />;
const inventoryReadFallback = <Navigate replace to="/dashboard" />;

export const inventoryRoutes = [
  {
    path: '/store-products',
    element: (
      <CanAccess fallback={storeProductsReadFallback} permission="store_products:read">
        <StoreProductListPage />
      </CanAccess>
    ),
  },
  {
    path: '/store-products/new',
    element: (
      <CanAccess fallback={storeProductsReadFallback} permission="store_products:create">
        <StoreProductCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/store-products/:storeProductId/edit',
    element: (
      <CanAccess fallback={storeProductsReadFallback} permission="store_products:update">
        <StoreProductEditPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/stocks',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:read">
        <InventoryStockListPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/stocks/new',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:create">
        <InventoryStockCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/stocks/:inventoryStockId',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:read">
        <InventoryStockDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/stocks/:inventoryStockId/edit',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:update">
        <InventoryStockEditPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/movements',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:read">
        <InventoryMovementListPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/movements/:movementId',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:read">
        <InventoryMovementDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/locks',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:read">
        <InventoryLockListPage />
      </CanAccess>
    ),
  },
  {
    path: '/inventory/locks/:lockId',
    element: (
      <CanAccess fallback={inventoryReadFallback} permission="inventory:read">
        <InventoryLockDetailPage />
      </CanAccess>
    ),
  },
];
