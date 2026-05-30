import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { getVendorOrders } from '../api/vendor-orders.api';
import { useVendorRealtimeStore } from '../../realtime-store-operations/store/vendor-realtime.store';
import type { VendorOrderHistoryFilters, VendorOrderStatus, VendorOrderStoreStatus } from '../types/vendor-orders.types';
import {
  HISTORY_ORDER_STATUSES,
  buildOrderHistoryQuery,
} from '../utils/vendor-orders-query.util';

const parseNumberParam = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const buildVendorOrderHistoryFilters = (
  searchParams: URLSearchParams,
): VendorOrderHistoryFilters => ({
  limit: parseNumberParam(searchParams.get('limit'), 20),
  page: parseNumberParam(searchParams.get('page'), 1),
  paymentStatus: searchParams.get('paymentStatus') === 'paid' ? 'paid' : undefined,
  status: parseHistoryStatus(searchParams.get('status')),
  storeStatus: parseStoreStatus(searchParams.get('storeStatus')),
});

const parseHistoryStatus = (value: string | null): VendorOrderStatus | undefined =>
  value && HISTORY_ORDER_STATUSES.includes(value as VendorOrderStatus)
    ? (value as VendorOrderStatus)
    : undefined;

const parseStoreStatus = (value: string | null): VendorOrderStoreStatus | undefined =>
  value === 'accepted' || value === 'pending_acceptance' || value === 'rejected'
    ? value
    : undefined;

export function useVendorOrderHistory() {
  const [searchParams] = useSearchParams();
  const socketConnected = useVendorRealtimeStore((state) => state.socketConnected);
  const query = buildOrderHistoryQuery(buildVendorOrderHistoryFilters(searchParams));

  return useQuery({
    queryKey: ['vendor-order-history', query],
    queryFn: () => getVendorOrders(query),
    refetchInterval: socketConnected ? false : 30000,
  });
}
