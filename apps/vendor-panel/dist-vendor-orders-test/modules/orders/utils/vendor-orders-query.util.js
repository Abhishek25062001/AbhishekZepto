"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHistoryVendorOrderStatus = exports.buildOrderHistoryQuery = exports.isActiveVendorOrderStatus = exports.buildActiveOrdersQuery = exports.buildIncomingOrdersQuery = exports.buildVendorOrderListQueryParams = exports.HISTORY_ORDER_STATUSES = exports.ACTIVE_ORDER_STATUSES = void 0;
exports.ACTIVE_ORDER_STATUSES = [
    'accepted',
    'picking',
    'packing',
    'ready_for_pickup',
];
exports.HISTORY_ORDER_STATUSES = [
    'accepted',
    'cancelled',
    'packing',
    'picking',
    'placed',
    'ready_for_pickup',
];
const buildVendorOrderListQueryParams = (query) => {
    const params = {};
    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }
        params[key] = value;
    });
    return params;
};
exports.buildVendorOrderListQueryParams = buildVendorOrderListQueryParams;
const buildIncomingOrdersQuery = (query = {}) => (0, exports.buildVendorOrderListQueryParams)({
    status: 'placed',
    storeStatus: 'pending_acceptance',
    ...query,
});
exports.buildIncomingOrdersQuery = buildIncomingOrdersQuery;
const buildActiveOrdersQuery = (query = {}) => (0, exports.buildVendorOrderListQueryParams)({
    storeStatus: 'accepted',
    ...query,
});
exports.buildActiveOrdersQuery = buildActiveOrdersQuery;
const isActiveVendorOrderStatus = (status) => exports.ACTIVE_ORDER_STATUSES.includes(status);
exports.isActiveVendorOrderStatus = isActiveVendorOrderStatus;
const buildOrderHistoryQuery = (query = {}) => (0, exports.buildVendorOrderListQueryParams)(query);
exports.buildOrderHistoryQuery = buildOrderHistoryQuery;
const isHistoryVendorOrderStatus = (status) => exports.HISTORY_ORDER_STATUSES.includes(status);
exports.isHistoryVendorOrderStatus = isHistoryVendorOrderStatus;
