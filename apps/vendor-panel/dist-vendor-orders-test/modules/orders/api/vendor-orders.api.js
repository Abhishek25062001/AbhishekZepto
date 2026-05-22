"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectVendorOrder = exports.acceptVendorOrder = exports.getVendorOrderById = exports.getVendorOrders = void 0;
const client_1 = require("../../../services/api/client");
const vendor_catalog_api_util_1 = require("../../store-catalog/utils/vendor-catalog-api.util");
const vendor_orders_query_util_1 = require("../utils/vendor-orders-query.util");
const BASE = '/api/v1/store/orders';
const getVendorOrders = async (query = {}) => {
    const response = await client_1.apiClient.get(BASE, {
        params: (0, vendor_orders_query_util_1.buildVendorOrderListQueryParams)(query),
    });
    return (0, vendor_catalog_api_util_1.unwrapPaginated)(response.data);
};
exports.getVendorOrders = getVendorOrders;
const getVendorOrderById = async (orderId) => {
    const response = await client_1.apiClient.get(`${BASE}/${orderId}`);
    return (0, vendor_catalog_api_util_1.unwrapData)(response.data);
};
exports.getVendorOrderById = getVendorOrderById;
const acceptVendorOrder = async (orderId) => {
    const response = await client_1.apiClient.post(`${BASE}/${orderId}/accept`);
    return (0, vendor_catalog_api_util_1.unwrapData)(response.data);
};
exports.acceptVendorOrder = acceptVendorOrder;
const rejectVendorOrder = async (orderId, payload) => {
    const response = await client_1.apiClient.post(`${BASE}/${orderId}/reject`, payload);
    return (0, vendor_catalog_api_util_1.unwrapData)(response.data);
};
exports.rejectVendorOrder = rejectVendorOrder;
