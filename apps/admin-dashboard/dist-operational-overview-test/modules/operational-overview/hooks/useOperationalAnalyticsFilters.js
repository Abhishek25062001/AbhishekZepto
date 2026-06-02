"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOperationalAnalyticsFilters = exports.cleanOperationalAnalyticsFilters = exports.OPERATIONAL_ANALYTICS_DEFAULT_FILTERS = void 0;
exports.OPERATIONAL_ANALYTICS_DEFAULT_FILTERS = {
    timezone: 'UTC',
};
const cleanOperationalAnalyticsFilters = (filters) => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''));
exports.cleanOperationalAnalyticsFilters = cleanOperationalAnalyticsFilters;
const mergeOperationalAnalyticsFilters = (current, next) => (0, exports.cleanOperationalAnalyticsFilters)({
    ...current,
    ...next,
});
exports.mergeOperationalAnalyticsFilters = mergeOperationalAnalyticsFilters;
