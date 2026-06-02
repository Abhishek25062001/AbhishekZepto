import { Navigate } from 'react-router-dom';

import { CanAccess } from '../components/auth/CanAccess';
import { AdminStoreDetailPage } from '../pages/stores/AdminStoreDetailPage';
import { AdminStoresPage } from '../pages/stores/AdminStoresPage';
import { CityCreatePage } from '../modules/stores/pages/cities/CityCreatePage';
import { CityEditPage } from '../modules/stores/pages/cities/CityEditPage';
import { CityListPage } from '../modules/stores/pages/cities/CityListPage';
import { ServiceAreaCreatePage } from '../modules/stores/pages/service-areas/ServiceAreaCreatePage';
import { ServiceAreaEditPage } from '../modules/stores/pages/service-areas/ServiceAreaEditPage';
import { ServiceAreaListPage } from '../modules/stores/pages/service-areas/ServiceAreaListPage';
import { StoreCreatePage } from '../modules/stores/pages/stores/StoreCreatePage';
import { StoreEditPage } from '../modules/stores/pages/stores/StoreEditPage';

const locationsReadFallback = <Navigate replace to="/dashboard" />;
const storesReadFallback = <Navigate replace to="/dashboard" />;

export const storeRoutes = [
  {
    path: '/locations/cities',
    element: (
      <CanAccess fallback={locationsReadFallback} permission="locations:read">
        <CityListPage />
      </CanAccess>
    ),
  },
  {
    path: '/locations/cities/new',
    element: (
      <CanAccess fallback={locationsReadFallback} permission="locations:create">
        <CityCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/locations/cities/:cityId/edit',
    element: (
      <CanAccess fallback={locationsReadFallback} permission="locations:update">
        <CityEditPage />
      </CanAccess>
    ),
  },
  {
    path: '/locations/service-areas',
    element: (
      <CanAccess fallback={locationsReadFallback} permission="locations:read">
        <ServiceAreaListPage />
      </CanAccess>
    ),
  },
  {
    path: '/locations/service-areas/new',
    element: (
      <CanAccess fallback={locationsReadFallback} permission="locations:create">
        <ServiceAreaCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/locations/service-areas/:serviceAreaId/edit',
    element: (
      <CanAccess fallback={locationsReadFallback} permission="locations:update">
        <ServiceAreaEditPage />
      </CanAccess>
    ),
  },
  {
    path: '/stores',
    element: (
      <CanAccess fallback={storesReadFallback} permission="stores:read">
        <AdminStoresPage />
      </CanAccess>
    ),
  },
  {
    path: '/stores/new',
    element: (
      <CanAccess fallback={storesReadFallback} permission="stores:create">
        <StoreCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/stores/:storeId',
    element: (
      <CanAccess fallback={storesReadFallback} permission="stores:read">
        <AdminStoreDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/stores/:storeId/edit',
    element: (
      <CanAccess fallback={storesReadFallback} permission="stores:update">
        <StoreEditPage />
      </CanAccess>
    ),
  },
];
