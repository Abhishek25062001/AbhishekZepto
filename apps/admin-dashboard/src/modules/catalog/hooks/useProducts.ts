import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminProducts } from '../api/product.api';
import type { ProductListQuery } from '../types/product.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/catalog-query-param.util';

export const buildProductListQuery = (searchParams: URLSearchParams): ProductListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  categoryId: parseOptionalString(searchParams.get('categoryId')),
  subcategoryId: parseOptionalString(searchParams.get('subcategoryId')),
  brandId: parseOptionalString(searchParams.get('brandId')),
  approvalStatus: parseOptionalString(
    searchParams.get('approvalStatus'),
  ) as ProductListQuery['approvalStatus'],
  status: parseOptionalString(searchParams.get('status')) as ProductListQuery['status'],
  isVisible: parseOptionalBoolean(searchParams.get('isVisible')),
  isFeatured: parseOptionalBoolean(searchParams.get('isFeatured')),
  foodType: parseOptionalString(searchParams.get('foodType')) as ProductListQuery['foodType'],
  productType: parseOptionalString(searchParams.get('productType')) as ProductListQuery['productType'],
  sortBy: parseOptionalString(searchParams.get('sortBy')) as ProductListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as ProductListQuery['sortOrder'],
});

export function useProducts() {
  const [searchParams] = useSearchParams();
  const query = buildProductListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-products', query],
    queryFn: () => getAdminProducts(query),
  });
}
