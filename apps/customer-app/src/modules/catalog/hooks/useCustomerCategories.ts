import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../../store/auth.store';
import { getCustomerCategories } from '../api/customer-catalog.api';
import type { CustomerCategory } from '../types/customer-category.types';

export const selectRootCategories = (categories: CustomerCategory[]) =>
  categories.filter((category) => category.parentCategoryId === null && category.level === 1);

export const selectSubcategories = (categories: CustomerCategory[], parentCategoryId: string) =>
  categories.filter((category) => category.parentCategoryId === parentCategoryId);

export function useCustomerCategories() {
  const cityId = useAuthStore((state) => state.cityId);

  return useQuery({
    queryKey: ['customer-catalog-categories', cityId],
    queryFn: () => getCustomerCategories(cityId),
  });
}
