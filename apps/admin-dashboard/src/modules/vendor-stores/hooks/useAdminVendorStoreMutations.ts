import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateAdminStoreStatus,
  updateAdminVendorStatus,
} from '../api/admin-vendor-store.api';
import type { StoreStatusPayload, VendorStatusPayload } from '../types/admin-vendor-store.types';
import { adminVendorStoreQueryKeys } from './useAdminVendors';

const invalidateVendorStores = async (
  queryClient: ReturnType<typeof useQueryClient>,
  detailKey: readonly unknown[],
) => {
  await queryClient.invalidateQueries({ queryKey: adminVendorStoreQueryKeys.all });
  await queryClient.invalidateQueries({ queryKey: detailKey });
};

export const useUpdateAdminVendorStatusMutation = (vendorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VendorStatusPayload) => updateAdminVendorStatus(vendorId, payload),
    onSuccess: async () =>
      invalidateVendorStores(queryClient, adminVendorStoreQueryKeys.vendorDetail(vendorId)),
  });
};

export const useUpdateAdminStoreStatusMutation = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StoreStatusPayload) => updateAdminStoreStatus(storeId, payload),
    onSuccess: async () =>
      invalidateVendorStores(queryClient, adminVendorStoreQueryKeys.storeDetail(storeId)),
  });
};
