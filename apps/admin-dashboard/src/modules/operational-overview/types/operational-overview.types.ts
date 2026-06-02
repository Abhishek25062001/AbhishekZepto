export type OperationalAnalyticsFilters = {
  fromDate?: string;
  toDate?: string;
  timezone?: string;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
};

export type AnalyticsWindow = {
  fromDate: string | null;
  toDate: string | null;
  timezone: string;
};

export type CountBreakdown = Record<string, number>;

export type StatusAnalyticsMetric = {
  total: number;
  byStatus: CountBreakdown;
};

export type SupportAnalyticsMetric = StatusAnalyticsMetric & {
  byPriority: CountBreakdown;
  byCategory: CountBreakdown;
};

export type OperationalOverviewResponse = {
  window: AnalyticsWindow;
  orders: StatusAnalyticsMetric;
  delivery: StatusAnalyticsMetric;
  stores: StatusAnalyticsMetric;
  support: SupportAnalyticsMetric;
};

export type OrderAnalyticsResponse = {
  window: AnalyticsWindow;
  orders: StatusAnalyticsMetric;
};

export type DeliveryAnalyticsResponse = {
  window: AnalyticsWindow;
  delivery: StatusAnalyticsMetric;
};

export type StoreAnalyticsResponse = {
  window: AnalyticsWindow;
  stores: StatusAnalyticsMetric;
};

export type SupportAnalyticsResponse = {
  window: AnalyticsWindow;
  support: SupportAnalyticsMetric;
};
