import { useQuery } from '@tanstack/react-query';

import { getAdminCategoryById } from '../api/category.api';

export function useCategoryDetail(categoryId: string | undefined) {
  return useQuery({
    queryKey: ['admin-category', categoryId],
    queryFn: () => getAdminCategoryById(categoryId!),
    enabled: Boolean(categoryId),
  });
}
