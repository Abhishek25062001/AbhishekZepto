import { useQuery } from '@tanstack/react-query';

import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { useAuthStore } from '../../../store/auth.store';
import { getCustomerCategories } from '../api/customer-catalog.api';
import type { CustomerCategory } from '../types/customer-category.types';

export const selectRootCategories = (categories: CustomerCategory[]) =>
  categories.filter((category) => category.parentCategoryId === null && category.level === 1);

export const selectSubcategories = (categories: CustomerCategory[], parentCategoryId: string) =>
  categories.filter((category) => category.parentCategoryId === parentCategoryId);

export function useCustomerCategories() {
  const authCityId = useAuthStore((state) => state.cityId);
  const { cityId: locationCityId, selectedStoreId } = useLocationContext();
  const cityId = locationCityId ?? authCityId;

  return useQuery({
    queryKey: ['customer-catalog-categories', cityId, selectedStoreId],
    queryFn: () => getCustomerCategories(cityId, selectedStoreId),
    enabled: Boolean(cityId),
  });
}
