import { Navigate } from 'react-router-dom';

import { CanAccess } from '../components/auth/CanAccess';
import { VendorCatalogProductDetailPage } from '../modules/store-catalog/pages/VendorCatalogProductDetailPage';
import { VendorCatalogProductListPage } from '../modules/store-catalog/pages/VendorCatalogProductListPage';
import { VendorStoreProductAvailabilityPage } from '../modules/store-catalog/pages/VendorStoreProductAvailabilityPage';
import { VendorStoreProductDetailPage } from '../modules/store-catalog/pages/VendorStoreProductDetailPage';
import { VendorStoreProductListPage } from '../modules/store-catalog/pages/VendorStoreProductListPage';
import { VendorStoreProductPricePage } from '../modules/store-catalog/pages/VendorStoreProductPricePage';

const catalogFallback = <Navigate replace to="/dashboard" />;
const storeProductsFallback = <Navigate replace to="/dashboard" />;

export const storeCatalogRoutes = [
  {
    path: '/store-catalog',
    element: <Navigate replace to="/store-catalog/products" />,
  },
  {
    path: '/store-catalog/products',
    element: (
      <CanAccess fallback={catalogFallback} permission="catalog:read">
        <VendorCatalogProductListPage />
      </CanAccess>
    ),
  },
  {
    path: '/store-catalog/products/:productId',
    element: (
      <CanAccess fallback={catalogFallback} permission="catalog:read">
        <VendorCatalogProductDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/store-products',
    element: (
      <CanAccess fallback={storeProductsFallback} permission="store_products:read">
        <VendorStoreProductListPage />
      </CanAccess>
    ),
  },
  {
    path: '/store-products/:storeProductId',
    element: (
      <CanAccess fallback={storeProductsFallback} permission="store_products:read">
        <VendorStoreProductDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/store-products/:storeProductId/price',
    element: (
      <CanAccess fallback={storeProductsFallback} permission="store_products:update">
        <VendorStoreProductPricePage />
      </CanAccess>
    ),
  },
  {
    path: '/store-products/:storeProductId/availability',
    element: (
      <CanAccess fallback={storeProductsFallback} permission="store_products:update">
        <VendorStoreProductAvailabilityPage />
      </CanAccess>
    ),
  },
];
