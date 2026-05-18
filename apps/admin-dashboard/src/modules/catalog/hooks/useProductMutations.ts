import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
  updateAdminProductApprovalStatus,
} from '../api/product.api';
import type { ProductApprovalPayload, ProductFormValues } from '../types/product.types';

export function useProductMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-product'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: ProductFormValues) => createAdminProduct(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: Partial<ProductFormValues> }) =>
      updateAdminProduct(productId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteAdminProduct(productId),
    onSuccess: invalidate,
  });

  const approvalMutation = useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: ProductApprovalPayload;
    }) => updateAdminProductApprovalStatus(productId, payload),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation, approvalMutation };
}
