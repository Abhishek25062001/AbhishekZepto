import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminInventoryMovements } from '../api/inventory-movement.api';
import type { InventoryMovementListQuery } from '../types/inventory-movement.types';
import { parseNumberParam, parseOptionalString } from '../utils/inventory-query-param.util';

export const buildInventoryMovementListQuery = (
  searchParams: URLSearchParams,
): InventoryMovementListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  storeId: parseOptionalString(searchParams.get('storeId')),
  vendorId: parseOptionalString(searchParams.get('vendorId')),
  cityId: parseOptionalString(searchParams.get('cityId')),
  inventoryStockId: parseOptionalString(searchParams.get('inventoryStockId')),
  storeProductId: parseOptionalString(searchParams.get('storeProductId')),
  productId: parseOptionalString(searchParams.get('productId')),
  variantId: parseOptionalString(searchParams.get('variantId')),
  movementType: parseOptionalString(searchParams.get('movementType')) as InventoryMovementListQuery['movementType'],
  referenceType: parseOptionalString(searchParams.get('referenceType')) as InventoryMovementListQuery['referenceType'],
  referenceId: parseOptionalString(searchParams.get('referenceId')),
  fromDate: parseOptionalString(searchParams.get('fromDate')),
  toDate: parseOptionalString(searchParams.get('toDate')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as InventoryMovementListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as InventoryMovementListQuery['sortOrder'],
});

export function useInventoryMovements() {
  const [searchParams] = useSearchParams();
  const query = buildInventoryMovementListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-inventory-movements', query],
    queryFn: () => getAdminInventoryMovements(query),
  });
}
