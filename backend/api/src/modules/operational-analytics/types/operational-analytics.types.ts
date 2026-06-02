export type OperationalAnalyticsQuery = {
  fromDate?: Date;
  toDate?: Date;
  timezone: string;
  storeId?: string;
  vendorId?: string;
  cityId?: string;
};

export type CountBreakdown = Record<string, number>;

export type AnalyticsWindow = {
  fromDate: string | null;
  toDate: string | null;
  timezone: string;
};

export type OperationalAnalyticsMetric = {
  total: number;
  byStatus?: CountBreakdown;
  byPriority?: CountBreakdown;
  byCategory?: CountBreakdown;
};

export type OperationalAnalyticsRepositorySummary = {
  total: number;
  breakdown: CountBreakdown;
};

export type OperationalAnalyticsOverview = {
  window: AnalyticsWindow;
  orders: OperationalAnalyticsMetric;
  delivery: OperationalAnalyticsMetric;
  stores: OperationalAnalyticsMetric;
  support: OperationalAnalyticsMetric;
};

export type OperationalAnalyticsOrdersResponse = {
  window: AnalyticsWindow;
  orders: OperationalAnalyticsMetric;
};

export type OperationalAnalyticsDeliveryResponse = {
  window: AnalyticsWindow;
  delivery: OperationalAnalyticsMetric;
};

export type OperationalAnalyticsStoresResponse = {
  window: AnalyticsWindow;
  stores: OperationalAnalyticsMetric;
};

export type OperationalAnalyticsSupportResponse = {
  window: AnalyticsWindow;
  support: OperationalAnalyticsMetric;
};
