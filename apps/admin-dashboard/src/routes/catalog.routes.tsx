import { Navigate } from 'react-router-dom';

import { CanAccess } from '../components/auth/CanAccess';
import { BrandCreatePage } from '../modules/catalog/pages/brands/BrandCreatePage';
import { BrandDetailPage } from '../modules/catalog/pages/brands/BrandDetailPage';
import { BrandEditPage } from '../modules/catalog/pages/brands/BrandEditPage';
import { BrandListPage } from '../modules/catalog/pages/brands/BrandListPage';
import { CategoryCreatePage } from '../modules/catalog/pages/categories/CategoryCreatePage';
import { CategoryDetailPage } from '../modules/catalog/pages/categories/CategoryDetailPage';
import { CategoryEditPage } from '../modules/catalog/pages/categories/CategoryEditPage';
import { CategoryListPage } from '../modules/catalog/pages/categories/CategoryListPage';
import { ProductCreatePage } from '../modules/catalog/pages/products/ProductCreatePage';
import { ProductDetailPage } from '../modules/catalog/pages/products/ProductDetailPage';
import { ProductEditPage } from '../modules/catalog/pages/products/ProductEditPage';
import { ProductListPage } from '../modules/catalog/pages/products/ProductListPage';
import { ProductUnitCreatePage } from '../modules/catalog/pages/units/ProductUnitCreatePage';
import { ProductUnitDetailPage } from '../modules/catalog/pages/units/ProductUnitDetailPage';
import { ProductUnitEditPage } from '../modules/catalog/pages/units/ProductUnitEditPage';
import { ProductUnitListPage } from '../modules/catalog/pages/units/ProductUnitListPage';
import { VariantListPage } from '../modules/catalog/pages/variants/VariantListPage';

const catalogReadFallback = <Navigate replace to="/dashboard" />;

export const catalogRoutes = [
  {
    path: '/catalog/categories',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <CategoryListPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/categories/new',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:create">
        <CategoryCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/categories/:categoryId',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <CategoryDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/categories/:categoryId/edit',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:update">
        <CategoryEditPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/brands',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <BrandListPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/brands/new',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:create">
        <BrandCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/brands/:brandId',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <BrandDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/brands/:brandId/edit',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:update">
        <BrandEditPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/units',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <ProductUnitListPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/units/new',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:create">
        <ProductUnitCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/units/:unitId',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <ProductUnitDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/units/:unitId/edit',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:update">
        <ProductUnitEditPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/products',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <ProductListPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/products/new',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:create">
        <ProductCreatePage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/products/:productId',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <ProductDetailPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/products/:productId/variants',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:read">
        <VariantListPage />
      </CanAccess>
    ),
  },
  {
    path: '/catalog/products/:productId/edit',
    element: (
      <CanAccess fallback={catalogReadFallback} permission="catalog:update">
        <ProductEditPage />
      </CanAccess>
    ),
  },
];
