import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getVendorStoreProducts } from '../api/vendor-store-product.api';
import type { VendorStoreProductListQuery } from '../types/vendor-store-product.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/vendor-catalog-query-param.util';

export const buildVendorStoreProductListQuery = (
  searchParams: URLSearchParams,
): VendorStoreProductListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  productId: parseOptionalString(searchParams.get('productId')),
  variantId: parseOptionalString(searchParams.get('variantId')),
  categoryId: parseOptionalString(searchParams.get('categoryId')),
  brandId: parseOptionalString(searchParams.get('brandId')),
  status: parseOptionalString(searchParams.get('status')) as VendorStoreProductListQuery['status'],
  isAvailable: parseOptionalBoolean(searchParams.get('isAvailable')),
  isVisible: parseOptionalBoolean(searchParams.get('isVisible')),
  isFeatured: parseOptionalBoolean(searchParams.get('isFeatured')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as VendorStoreProductListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as VendorStoreProductListQuery['sortOrder'],
});

export function useVendorStoreProducts() {
  const [searchParams] = useSearchParams();
  const query = buildVendorStoreProductListQuery(searchParams);

  return useQuery({
    queryKey: ['vendor-store-products', query],
    queryFn: () => getVendorStoreProducts(query),
  });
}
