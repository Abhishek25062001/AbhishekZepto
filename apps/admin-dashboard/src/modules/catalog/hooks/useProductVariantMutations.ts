import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAdminProductVariant,
  deleteAdminProductVariant,
  updateAdminProductVariant,
} from '../api/product.api';
import type { ProductVariantFormValues } from '../types/product-variant.types';

export function useProductVariantMutations(productId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-product-variants', productId] });
    void queryClient.invalidateQueries({ queryKey: ['admin-product', productId] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: ProductVariantFormValues) => createAdminProductVariant(productId, payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      payload,
      variantId,
    }: {
      payload: Partial<ProductVariantFormValues>;
      variantId: string;
    }) => updateAdminProductVariant(productId, variantId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (variantId: string) => deleteAdminProductVariant(productId, variantId),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
}
