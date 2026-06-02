import { apiClient } from '../../../services/api/client';
import type { ApiSuccessResponse } from '../../../types/api.types';
import type {
  DeliveryAnalyticsResponse,
  OperationalAnalyticsFilters,
  OperationalOverviewResponse,
  OrderAnalyticsResponse,
  StoreAnalyticsResponse,
  SupportAnalyticsResponse,
} from '../types/operational-overview.types';

const BASE = '/api/v1/admin/analytics';

export const buildOperationalAnalyticsParams = (
  filters: OperationalAnalyticsFilters = {},
): OperationalAnalyticsFilters => Object.fromEntries(
  Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
) as OperationalAnalyticsFilters;

const getAnalytics = async <T>(
  path: string,
  filters: OperationalAnalyticsFilters = {},
): Promise<T> => {
  const response = await apiClient.get<ApiSuccessResponse<T>>(`${BASE}${path}`, {
    params: buildOperationalAnalyticsParams(filters),
  });

  return response.data.data;
};

export const getOperationalOverview = (
  filters: OperationalAnalyticsFilters = {},
): Promise<OperationalOverviewResponse> => getAnalytics('/overview', filters);

export const getOrderAnalytics = (
  filters: OperationalAnalyticsFilters = {},
): Promise<OrderAnalyticsResponse> => getAnalytics('/orders', filters);

export const getDeliveryAnalytics = (
  filters: OperationalAnalyticsFilters = {},
): Promise<DeliveryAnalyticsResponse> => getAnalytics('/delivery', filters);

export const getStoreAnalytics = (
  filters: OperationalAnalyticsFilters = {},
): Promise<StoreAnalyticsResponse> => getAnalytics('/stores', filters);

export const getSupportAnalytics = (
  filters: OperationalAnalyticsFilters = {},
): Promise<SupportAnalyticsResponse> => getAnalytics('/support', filters);
