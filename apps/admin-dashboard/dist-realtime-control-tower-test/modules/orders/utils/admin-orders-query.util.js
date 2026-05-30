"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAdminOrderSearchParams = exports.buildAdminOrderListQuery = exports.parseAdminOrderStringParam = exports.parseAdminOrderNumberParam = void 0;
const parseAdminOrderNumberParam = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
exports.parseAdminOrderNumberParam = parseAdminOrderNumberParam;
const parseAdminOrderStringParam = (value) => value && value.trim() ? value.trim() : undefined;
exports.parseAdminOrderStringParam = parseAdminOrderStringParam;
const buildAdminOrderListQuery = (params) => ({
    page: (0, exports.parseAdminOrderNumberParam)(params.get('page'), 1),
    limit: (0, exports.parseAdminOrderNumberParam)(params.get('limit'), 20),
    status: (0, exports.parseAdminOrderStringParam)(params.get('status')),
    storeStatus: (0, exports.parseAdminOrderStringParam)(params.get('storeStatus')),
    storeId: (0, exports.parseAdminOrderStringParam)(params.get('storeId')),
    cityId: (0, exports.parseAdminOrderStringParam)(params.get('cityId')),
    paymentStatus: (0, exports.parseAdminOrderStringParam)(params.get('paymentStatus')),
    customerId: (0, exports.parseAdminOrderStringParam)(params.get('customerId')),
    slaStatus: (0, exports.parseAdminOrderStringParam)(params.get('slaStatus')),
    slaBreachedStage: (0, exports.parseAdminOrderStringParam)(params.get('slaBreachedStage')),
    fromDate: (0, exports.parseAdminOrderStringParam)(params.get('fromDate')),
    toDate: (0, exports.parseAdminOrderStringParam)(params.get('toDate')),
    sort: (0, exports.parseAdminOrderStringParam)(params.get('sort')),
});
exports.buildAdminOrderListQuery = buildAdminOrderListQuery;
const setAdminOrderSearchParams = (params, updates) => {
    Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            params.delete(key);
            return;
        }
        params.set(key, String(value));
    });
};
exports.setAdminOrderSearchParams = setAdminOrderSearchParams;
