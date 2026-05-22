"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAdminOrder = exports.updateAdminOrderStatus = exports.getAdminOrderTimeline = exports.getAdminOrderById = exports.getAdminOrders = void 0;
const client_1 = require("../../../services/api/client");
const BASE = '/api/v1/admin/orders';
const unwrapData = (response) => response.data;
const unwrapPaginated = (response) => ({
    items: response.data,
    pagination: response.meta.pagination ?? {
        page: 1,
        limit: response.data.length,
        total: response.data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    },
});
const getAdminOrders = async (query = {}) => {
    const response = await client_1.apiClient.get(BASE, {
        params: query,
    });
    return unwrapPaginated(response.data);
};
exports.getAdminOrders = getAdminOrders;
const getAdminOrderById = async (orderId) => {
    const response = await client_1.apiClient.get(`${BASE}/${orderId}`);
    return unwrapData(response.data);
};
exports.getAdminOrderById = getAdminOrderById;
const getAdminOrderTimeline = async (orderId) => {
    const response = await client_1.apiClient.get(`${BASE}/${orderId}/timeline`);
    return unwrapData(response.data);
};
exports.getAdminOrderTimeline = getAdminOrderTimeline;
const updateAdminOrderStatus = async (orderId, payload) => {
    const response = await client_1.apiClient.post(`${BASE}/${orderId}/status`, payload);
    return unwrapData(response.data);
};
exports.updateAdminOrderStatus = updateAdminOrderStatus;
const cancelAdminOrder = async (orderId, payload) => {
    const response = await client_1.apiClient.post(`${BASE}/${orderId}/cancel`, payload);
    return unwrapData(response.data);
};
exports.cancelAdminOrder = cancelAdminOrder;
