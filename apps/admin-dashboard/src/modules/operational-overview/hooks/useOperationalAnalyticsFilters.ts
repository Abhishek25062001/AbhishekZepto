import type { OperationalAnalyticsFilters } from '../types/operational-overview.types';

export const OPERATIONAL_ANALYTICS_DEFAULT_FILTERS: OperationalAnalyticsFilters = {
  timezone: 'UTC',
};

export const cleanOperationalAnalyticsFilters = (
  filters: OperationalAnalyticsFilters,
): OperationalAnalyticsFilters => Object.fromEntries(
  Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
) as OperationalAnalyticsFilters;

export const mergeOperationalAnalyticsFilters = (
  current: OperationalAnalyticsFilters,
  next: OperationalAnalyticsFilters,
): OperationalAnalyticsFilters => cleanOperationalAnalyticsFilters({
  ...current,
  ...next,
});
