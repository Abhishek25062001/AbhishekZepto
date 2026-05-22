import type { VendorOrderListQuery, VendorOrderStatus } from '../types/vendor-orders.types';

export const ACTIVE_ORDER_STATUSES: readonly VendorOrderStatus[] = [
  'accepted',
  'picking',
  'packing',
  'ready_for_pickup',
] as const;

export const HISTORY_ORDER_STATUSES: readonly VendorOrderStatus[] = [
  'accepted',
  'cancelled',
  'packing',
  'picking',
  'placed',
  'ready_for_pickup',
] as const;

export const buildVendorOrderListQueryParams = (
  query: VendorOrderListQuery,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    params[key] = value;
  });

  return params;
};

export const buildIncomingOrdersQuery = (
  query: VendorOrderListQuery = {},
): Record<string, string | number> =>
  buildVendorOrderListQueryParams({
    status: 'placed',
    storeStatus: 'pending_acceptance',
    ...query,
  });

export const buildActiveOrdersQuery = (
  query: VendorOrderListQuery = {},
): Record<string, string | number> =>
  buildVendorOrderListQueryParams({
    storeStatus: 'accepted',
    ...query,
  });

export const isActiveVendorOrderStatus = (status: VendorOrderStatus) =>
  ACTIVE_ORDER_STATUSES.includes(status);

export const buildOrderHistoryQuery = (
  query: VendorOrderListQuery = {},
): Record<string, string | number> =>
  buildVendorOrderListQueryParams(query);

export const isHistoryVendorOrderStatus = (status: VendorOrderStatus) =>
  HISTORY_ORDER_STATUSES.includes(status);
