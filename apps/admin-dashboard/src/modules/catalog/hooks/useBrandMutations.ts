import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createAdminBrand, deleteAdminBrand, updateAdminBrand } from '../api/brand.api';
import type { BrandFormValues } from '../types/brand.types';

export function useBrandMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-brand'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: BrandFormValues) => createAdminBrand(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ brandId, payload }: { brandId: string; payload: Partial<BrandFormValues> }) =>
      updateAdminBrand(brandId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (brandId: string) => deleteAdminBrand(brandId),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
