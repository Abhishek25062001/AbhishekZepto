import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAdminCategory,
  deleteAdminCategory,
  updateAdminCategory,
} from '../api/category.api';
import type { CategoryFormValues } from '../types/category.types';

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-category'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CategoryFormValues) => createAdminCategory(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: string; payload: Partial<CategoryFormValues> }) =>
      updateAdminCategory(categoryId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => deleteAdminCategory(categoryId),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
