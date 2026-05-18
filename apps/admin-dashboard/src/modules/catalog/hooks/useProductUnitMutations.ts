import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAdminProductUnit,
  deleteAdminProductUnit,
  updateAdminProductUnit,
} from '../api/product-unit.api';
import type { ProductUnitFormValues } from '../types/product-unit.types';

export function useProductUnitMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-product-units'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-product-unit'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: ProductUnitFormValues) => createAdminProductUnit(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ unitId, payload }: { unitId: string; payload: Partial<ProductUnitFormValues> }) =>
      updateAdminProductUnit(unitId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (unitId: string) => deleteAdminProductUnit(unitId),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
