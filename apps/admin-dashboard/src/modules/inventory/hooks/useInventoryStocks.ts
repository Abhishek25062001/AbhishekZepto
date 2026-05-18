import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getAdminInventoryStocks } from '../api/inventory-stock.api';
import type { InventoryStockListQuery } from '../types/inventory-stock.types';
import {
  parseNumberParam,
  parseOptionalBoolean,
  parseOptionalString,
} from '../utils/inventory-query-param.util';

export const buildInventoryStockListQuery = (
  searchParams: URLSearchParams,
): InventoryStockListQuery => ({
  page: parseNumberParam(searchParams.get('page'), 1),
  limit: parseNumberParam(searchParams.get('limit'), 20),
  search: parseOptionalString(searchParams.get('search')),
  storeId: parseOptionalString(searchParams.get('storeId')),
  vendorId: parseOptionalString(searchParams.get('vendorId')),
  cityId: parseOptionalString(searchParams.get('cityId')),
  storeProductId: parseOptionalString(searchParams.get('storeProductId')),
  productId: parseOptionalString(searchParams.get('productId')),
  variantId: parseOptionalString(searchParams.get('variantId')),
  sku: parseOptionalString(searchParams.get('sku')),
  isLowStock: parseOptionalBoolean(searchParams.get('isLowStock')),
  isOutOfStock: parseOptionalBoolean(searchParams.get('isOutOfStock')),
  status: parseOptionalString(searchParams.get('status')) as InventoryStockListQuery['status'],
  sortBy: parseOptionalString(searchParams.get('sortBy')) as InventoryStockListQuery['sortBy'],
  sortOrder: parseOptionalString(searchParams.get('sortOrder')) as InventoryStockListQuery['sortOrder'],
});

export function useInventoryStocks() {
  const [searchParams] = useSearchParams();
  const query = buildInventoryStockListQuery(searchParams);

  return useQuery({
    queryKey: ['admin-inventory-stocks', query],
    queryFn: () => getAdminInventoryStocks(query),
  });
}
