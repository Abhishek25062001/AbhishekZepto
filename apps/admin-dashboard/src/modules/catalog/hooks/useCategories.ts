import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminCategories } from '../api/category.api';
import type { CategoryListQuery } from '../types/category.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/catalog-query-param.util';

export const buildCategoryListQuery = (searchParams: URLSearchParams): CategoryListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  status: parseOptionalString(searchParams.get('status')) as CategoryListQuery['status'],
  isVisible: parseOptionalBoolean(searchParams.get('isVisible')),
  isFeatured: parseOptionalBoolean(searchParams.get('isFeatured')),
  parentCategoryId: parseOptionalString(searchParams.get('parentCategoryId')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as CategoryListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as CategoryListQuery['sortOrder'],
});

export function useCategories() {
  const [searchParams] = useSearchParams();
  const query = buildCategoryListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-categories', query],
    queryFn: () => getAdminCategories(query),
  });
}
