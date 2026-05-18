import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminStoreProducts } from '../api/store-product.api';
import type { StoreProductListQuery } from '../types/store-product.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/inventory-query-param.util';

export const buildStoreProductListQuery = (searchParams: URLSearchParams): StoreProductListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  storeId: parseOptionalString(searchParams.get('storeId')),
  vendorId: parseOptionalString(searchParams.get('vendorId')),
  cityId: parseOptionalString(searchParams.get('cityId')),
  productId: parseOptionalString(searchParams.get('productId')),
  variantId: parseOptionalString(searchParams.get('variantId')),
  categoryId: parseOptionalString(searchParams.get('categoryId')),
  brandId: parseOptionalString(searchParams.get('brandId')),
  status: parseOptionalString(searchParams.get('status')) as StoreProductListQuery['status'],
  isAvailable: parseOptionalBoolean(searchParams.get('isAvailable')),
  isVisible: parseOptionalBoolean(searchParams.get('isVisible')),
  isFeatured: parseOptionalBoolean(searchParams.get('isFeatured')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as StoreProductListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as StoreProductListQuery['sortOrder'],
});

export function useStoreProducts() {
  const [searchParams] = useSearchParams();
  const query = buildStoreProductListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-store-products', query],
    queryFn: () => getAdminStoreProducts(query),
  });
}
