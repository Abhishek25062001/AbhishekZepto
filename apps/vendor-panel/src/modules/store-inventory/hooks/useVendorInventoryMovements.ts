import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getVendorInventoryMovements } from '../api/vendor-inventory.api';
import type { VendorInventoryMovementListQuery } from '../types/vendor-inventory.types';
import {
  parseNumberParam,
  parseOptionalString,
} from '../utils/vendor-inventory-query-param.util';

export const buildVendorInventoryMovementListQuery = (
  searchParams: URLSearchParams,
): VendorInventoryMovementListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  inventoryStockId: parseOptionalString(searchParams.get('inventoryStockId')),
  storeProductId: parseOptionalString(searchParams.get('storeProductId')),
  productId: parseOptionalString(searchParams.get('productId')),
  variantId: parseOptionalString(searchParams.get('variantId')),
  movementType: parseOptionalString(searchParams.get('movementType')) as VendorInventoryMovementListQuery['movementType'],
  referenceType: parseOptionalString(searchParams.get('referenceType')) as VendorInventoryMovementListQuery['referenceType'],
  referenceId: parseOptionalString(searchParams.get('referenceId')),
  fromDate: parseOptionalString(searchParams.get('fromDate')),
  toDate: parseOptionalString(searchParams.get('toDate')),
  sortBy: parseOptionalString(searchParams.get('sortBy')) as VendorInventoryMovementListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as VendorInventoryMovementListQuery['sortOrder'],
});

export function useVendorInventoryMovements() {
  const [searchParams] = useSearchParams();
  const query = buildVendorInventoryMovementListQuery(searchParams);

  return useQuery({
    queryKey: ['vendor-inventory-movements', query],
    queryFn: () => getVendorInventoryMovements(query),
  });
}
