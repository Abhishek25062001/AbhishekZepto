import type { AdminOrderListQuery } from '../types/admin-orders.types';

export const parseAdminOrderNumberParam = (value: string | null, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const parseAdminOrderStringParam = (value: string | null): string | undefined =>
  value && value.trim() ? value.trim() : undefined;

export const buildAdminOrderListQuery = (
  params: URLSearchParams,
): AdminOrderListQuery => ({
  page: parseAdminOrderNumberParam(params.get('page'), 1),
  limit: parseAdminOrderNumberParam(params.get('limit'), 20),
  status: parseAdminOrderStringParam(params.get('status')) as AdminOrderListQuery['status'],
  storeStatus: parseAdminOrderStringParam(params.get('storeStatus')) as AdminOrderListQuery['storeStatus'],
  storeId: parseAdminOrderStringParam(params.get('storeId')),
  cityId: parseAdminOrderStringParam(params.get('cityId')),
  paymentStatus: parseAdminOrderStringParam(params.get('paymentStatus')) as AdminOrderListQuery['paymentStatus'],
  customerId: parseAdminOrderStringParam(params.get('customerId')),
  slaStatus: parseAdminOrderStringParam(params.get('slaStatus')),
  slaBreachedStage: parseAdminOrderStringParam(params.get('slaBreachedStage')),
  fromDate: parseAdminOrderStringParam(params.get('fromDate')),
  toDate: parseAdminOrderStringParam(params.get('toDate')),
  sort: parseAdminOrderStringParam(params.get('sort')) as AdminOrderListQuery['sort'],
});

export const setAdminOrderSearchParams = (
  params: URLSearchParams,
  updates: Record<string, string | number | undefined | null>,
) => {
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      params.delete(key);
      return;
    }

    params.set(key, String(value));
  });
};
