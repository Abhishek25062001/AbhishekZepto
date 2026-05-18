import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getVendorInventoryStocks } from '../api/vendor-inventory.api';
import type { VendorInventoryStockListQuery } from '../types/vendor-inventory.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/vendor-inventory-query-param.util';

export const buildVendorInventoryStockListQuery = (
  searchParams: URLSearchParams,
): VendorInventoryStockListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  storeProductId: parseOptionalString(searchParams.get('storeProductId')),
  productId: parseOptionalString(searchParams.get('productId')),
  variantId: parseOptionalString(searchParams.get('variantId')),
  sku: parseOptionalString(searchParams.get('sku')),
  isLowStock: parseOptionalBoolean(searchParams.get('isLowStock')),
  isOutOfStock: parseOptionalBoolean(searchParams.get('isOutOfStock')),
  status: parseOptionalString(searchParams.get('status')) as VendorInventoryStockListQuery['status'],
  sortBy: parseOptionalString(searchParams.get('sortBy')) as VendorInventoryStockListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as VendorInventoryStockListQuery['sortOrder'],
});

export function useVendorInventoryStocks() {
  const [searchParams] = useSearchParams();
  const query = buildVendorInventoryStockListQuery(searchParams);

  return useQuery({
    queryKey: ['vendor-inventory-stocks', query],
    queryFn: () => getVendorInventoryStocks(query),
  });
}
