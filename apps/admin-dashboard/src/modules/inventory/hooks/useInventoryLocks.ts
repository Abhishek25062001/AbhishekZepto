import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminInventoryLocks } from '../api/inventory-lock.api';
import type { InventoryLockListQuery } from '../types/inventory-lock.types';
import { parseNumberParam, parseOptionalString } from '../utils/inventory-query-param.util';

export const buildInventoryLockListQuery = (searchParams: URLSearchParams): InventoryLockListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  storeId: parseOptionalString(searchParams.get('storeId')),
  vendorId: parseOptionalString(searchParams.get('vendorId')),
  cityId: parseOptionalString(searchParams.get('cityId')),
  inventoryStockId: parseOptionalString(searchParams.get('inventoryStockId')),
  storeProductId: parseOptionalString(searchParams.get('storeProductId')),
  productId: parseOptionalString(searchParams.get('productId')),
  variantId: parseOptionalString(searchParams.get('variantId')),
  customerId: parseOptionalString(searchParams.get('customerId')),
  cartId: parseOptionalString(searchParams.get('cartId')),
  orderId: parseOptionalString(searchParams.get('orderId')),
  lockType: parseOptionalString(searchParams.get('lockType')) as InventoryLockListQuery['lockType'],
  status: parseOptionalString(searchParams.get('status')) as InventoryLockListQuery['status'],
  fromDate: parseOptionalString(searchParams.get('fromDate')),
  toDate: parseOptionalString(searchParams.get('toDate')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as InventoryLockListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as InventoryLockListQuery['sortOrder'],
});

export function useInventoryLocks() {
  const [searchParams] = useSearchParams();
  const query = buildInventoryLockListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-inventory-locks', query],
    queryFn: () => getAdminInventoryLocks(query),
  });
}
