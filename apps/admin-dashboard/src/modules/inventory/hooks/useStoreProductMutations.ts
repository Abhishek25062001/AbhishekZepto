import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  bulkMapAdminStoreProducts,
  bulkUpdateAdminStoreProductPrices,
  bulkUpdateAdminStoreProductVisibility,
  createAdminStoreProduct,
  deleteAdminStoreProduct,
  updateAdminStoreProduct,
} from '../api/store-product.api';
import type {
  BulkStoreProductMapPayload,
  BulkStoreProductPricePayload,
  BulkStoreProductVisibilityPayload,
  StoreProductFormValues,
} from '../types/store-product.types';

export function useStoreProductMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-store-products'] });
    void queryClient.invalidateQueries({ queryKey: ['admin-store-product'] });
  };

  const createMutation = useMutation({
    mutationFn: (payload: StoreProductFormValues) => createAdminStoreProduct(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      storeProductId,
      payload,
    }: {
      storeProductId: string;
      payload: Partial<StoreProductFormValues>;
    }) => updateAdminStoreProduct(storeProductId, payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (storeProductId: string) => deleteAdminStoreProduct(storeProductId),
    onSuccess: invalidate,
  });

  const bulkMapMutation = useMutation({
    mutationFn: (payload: BulkStoreProductMapPayload) => bulkMapAdminStoreProducts(payload),
    onSuccess: invalidate,
  });

  const bulkPriceMutation = useMutation({
    mutationFn: (payload: BulkStoreProductPricePayload) => bulkUpdateAdminStoreProductPrices(payload),
    onSuccess: invalidate,
  });

  const bulkVisibilityMutation = useMutation({
    mutationFn: (payload: BulkStoreProductVisibilityPayload) =>
      bulkUpdateAdminStoreProductVisibility(payload),
    onSuccess: invalidate,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    bulkMapMutation,
    bulkPriceMutation,
    bulkVisibilityMutation,
  };
}
