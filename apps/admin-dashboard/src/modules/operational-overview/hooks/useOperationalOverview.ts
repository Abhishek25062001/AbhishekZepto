import { useQuery } from '@tanstack/react-query';

import {
  getDeliveryAnalytics,
  getOperationalOverview,
  getOrderAnalytics,
  getStoreAnalytics,
  getSupportAnalytics,
} from '../api/operational-overview.api';
import type { OperationalAnalyticsFilters } from '../types/operational-overview.types';

export const operationalOverviewQueryKeys = {
  all: ['operational-overview'] as const,
  overview: (filters: OperationalAnalyticsFilters) => [
    ...operationalOverviewQueryKeys.all,
    'overview',
    filters,
  ] as const,
  orders: (filters: OperationalAnalyticsFilters) => [
    ...operationalOverviewQueryKeys.all,
    'orders',
    filters,
  ] as const,
  delivery: (filters: OperationalAnalyticsFilters) => [
    ...operationalOverviewQueryKeys.all,
    'delivery',
    filters,
  ] as const,
  stores: (filters: OperationalAnalyticsFilters) => [
    ...operationalOverviewQueryKeys.all,
    'stores',
    filters,
  ] as const,
  support: (filters: OperationalAnalyticsFilters) => [
    ...operationalOverviewQueryKeys.all,
    'support',
    filters,
  ] as const,
};

export const useOperationalOverview = (filters: OperationalAnalyticsFilters = {}) => useQuery({
  queryKey: operationalOverviewQueryKeys.overview(filters),
  queryFn: () => getOperationalOverview(filters),
});

export const useOrderAnalytics = (filters: OperationalAnalyticsFilters = {}) => useQuery({
  queryKey: operationalOverviewQueryKeys.orders(filters),
  queryFn: () => getOrderAnalytics(filters),
});

export const useDeliveryAnalytics = (filters: OperationalAnalyticsFilters = {}) => useQuery({
  queryKey: operationalOverviewQueryKeys.delivery(filters),
  queryFn: () => getDeliveryAnalytics(filters),
});

export const useStoreAnalytics = (filters: OperationalAnalyticsFilters = {}) => useQuery({
  queryKey: operationalOverviewQueryKeys.stores(filters),
  queryFn: () => getStoreAnalytics(filters),
});

export const useSupportAnalytics = (filters: OperationalAnalyticsFilters = {}) => useQuery({
  queryKey: operationalOverviewQueryKeys.support(filters),
  queryFn: () => getSupportAnalytics(filters),
});
