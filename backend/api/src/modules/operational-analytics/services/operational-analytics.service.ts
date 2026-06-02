import {
  summarizeDeliveryAssignments,
  summarizeOrders,
  summarizeStores,
  summarizeSupportTickets,
} from '../repositories/operational-analytics.repository';
import type {
  AnalyticsWindow,
  CountBreakdown,
  OperationalAnalyticsDeliveryResponse,
  OperationalAnalyticsMetric,
  OperationalAnalyticsOrdersResponse,
  OperationalAnalyticsOverview,
  OperationalAnalyticsQuery,
  OperationalAnalyticsRepositorySummary,
  OperationalAnalyticsStoresResponse,
  OperationalAnalyticsSupportResponse,
} from '../types/operational-analytics.types';

export type OperationalAnalyticsRepository = {
  summarizeOrders: typeof summarizeOrders;
  summarizeDeliveryAssignments: typeof summarizeDeliveryAssignments;
  summarizeStores: typeof summarizeStores;
  summarizeSupportTickets: typeof summarizeSupportTickets;
};

const defaultRepository: OperationalAnalyticsRepository = {
  summarizeOrders,
  summarizeDeliveryAssignments,
  summarizeStores,
  summarizeSupportTickets,
};

const normalizeBreakdown = (breakdown?: CountBreakdown): CountBreakdown => breakdown ?? {};

const buildWindow = (query: OperationalAnalyticsQuery): AnalyticsWindow => ({
  fromDate: query.fromDate?.toISOString() ?? null,
  toDate: query.toDate?.toISOString() ?? null,
  timezone: query.timezone,
});

const toStatusMetric = (summary: OperationalAnalyticsRepositorySummary): OperationalAnalyticsMetric => ({
  total: summary.total,
  byStatus: normalizeBreakdown(summary.breakdown),
});

const toSupportMetric = (
  summary: Awaited<ReturnType<typeof summarizeSupportTickets>>,
): OperationalAnalyticsMetric => ({
  total: summary.status.total,
  byStatus: normalizeBreakdown(summary.status.breakdown),
  byPriority: normalizeBreakdown(summary.priority.breakdown),
  byCategory: normalizeBreakdown(summary.category.breakdown),
});

export const getOperationalAnalyticsOverview = async (
  query: OperationalAnalyticsQuery,
  repository: OperationalAnalyticsRepository = defaultRepository,
): Promise<OperationalAnalyticsOverview> => {
  const [orders, delivery, stores, support] = await Promise.all([
    repository.summarizeOrders(query),
    repository.summarizeDeliveryAssignments(query),
    repository.summarizeStores(query),
    repository.summarizeSupportTickets(query),
  ]);

  return {
    window: buildWindow(query),
    orders: toStatusMetric(orders),
    delivery: toStatusMetric(delivery),
    stores: toStatusMetric(stores),
    support: toSupportMetric(support),
  };
};

export const getOperationalAnalyticsOrders = async (
  query: OperationalAnalyticsQuery,
  repository: Pick<OperationalAnalyticsRepository, 'summarizeOrders'> = defaultRepository,
): Promise<OperationalAnalyticsOrdersResponse> => {
  const orders = await repository.summarizeOrders(query);

  return {
    window: buildWindow(query),
    orders: toStatusMetric(orders),
  };
};

export const getOperationalAnalyticsDelivery = async (
  query: OperationalAnalyticsQuery,
  repository: Pick<OperationalAnalyticsRepository, 'summarizeDeliveryAssignments'> = defaultRepository,
): Promise<OperationalAnalyticsDeliveryResponse> => {
  const delivery = await repository.summarizeDeliveryAssignments(query);

  return {
    window: buildWindow(query),
    delivery: toStatusMetric(delivery),
  };
};

export const getOperationalAnalyticsStores = async (
  query: OperationalAnalyticsQuery,
  repository: Pick<OperationalAnalyticsRepository, 'summarizeStores'> = defaultRepository,
): Promise<OperationalAnalyticsStoresResponse> => {
  const stores = await repository.summarizeStores(query);

  return {
    window: buildWindow(query),
    stores: toStatusMetric(stores),
  };
};

export const getOperationalAnalyticsSupport = async (
  query: OperationalAnalyticsQuery,
  repository: Pick<OperationalAnalyticsRepository, 'summarizeSupportTickets'> = defaultRepository,
): Promise<OperationalAnalyticsSupportResponse> => {
  const support = await repository.summarizeSupportTickets(query);

  return {
    window: buildWindow(query),
    support: toSupportMetric(support),
  };
};
