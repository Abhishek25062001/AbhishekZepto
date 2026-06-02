import { useQuery } from '@tanstack/react-query';

import { listAdminVendors } from '../api/admin-vendor-store.api';
import type { AdminVendorListQuery } from '../types/admin-vendor-store.types';

export const adminVendorStoreQueryKeys = {
  all: ['admin-vendor-stores'] as const,
  vendors: (query: AdminVendorListQuery) =>
    [...adminVendorStoreQueryKeys.all, 'vendors', query] as const,
  vendorDetail: (vendorId: string) =>
    [...adminVendorStoreQueryKeys.all, 'vendor-detail', vendorId] as const,
  stores: (query: unknown) => [...adminVendorStoreQueryKeys.all, 'stores', query] as const,
  storeDetail: (storeId: string) =>
    [...adminVendorStoreQueryKeys.all, 'store-detail', storeId] as const,
  storeOrders: (storeId: string, query: unknown) =>
    [...adminVendorStoreQueryKeys.all, 'store-orders', storeId, query] as const,
  storeInventory: (storeId: string, query: unknown) =>
    [...adminVendorStoreQueryKeys.all, 'store-inventory', storeId, query] as const,
  storeAudit: (storeId: string, query: unknown) =>
    [...adminVendorStoreQueryKeys.all, 'store-audit', storeId, query] as const,
};

export const useAdminVendors = (query: AdminVendorListQuery = {}) => useQuery({
  queryKey: adminVendorStoreQueryKeys.vendors(query),
  queryFn: () => listAdminVendors(query),
});
