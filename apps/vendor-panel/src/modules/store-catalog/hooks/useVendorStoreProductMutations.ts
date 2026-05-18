import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  patchVendorStoreProductAvailability,
  patchVendorStoreProductPrice,
} from '../api/vendor-store-product.api';
import type {
  VendorAvailabilityUpdatePayload,
  VendorPriceUpdatePayload,
} from '../types/vendor-store-product.types';

export function useVendorStoreProductMutations() {
  const queryClient = useQueryClient();

  const invalidate = (storeProductId: string) => {
    void queryClient.invalidateQueries({ queryKey: ['vendor-store-products'] });
    void queryClient.invalidateQueries({ queryKey: ['vendor-store-product', storeProductId] });
  };

  const updateAvailability = useMutation({
    mutationFn: ({
      storeProductId,
      payload,
    }: {
      storeProductId: string;
      payload: VendorAvailabilityUpdatePayload;
    }) => patchVendorStoreProductAvailability(storeProductId, payload),
    onSuccess: (_data, variables) => invalidate(variables.storeProductId),
  });

  const updatePrice = useMutation({
    mutationFn: ({
      storeProductId,
      payload,
    }: {
      storeProductId: string;
      payload: VendorPriceUpdatePayload;
    }) => patchVendorStoreProductPrice(storeProductId, payload),
    onSuccess: (_data, variables) => invalidate(variables.storeProductId),
  });

  return { updateAvailability, updatePrice };
}
