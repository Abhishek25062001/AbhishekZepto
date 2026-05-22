"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapPaginated = exports.unwrapData = void 0;
const unwrapData = (response) => response.data;
exports.unwrapData = unwrapData;
const unwrapPaginated = (response) => {
    const pagination = response.meta.pagination;
    if (!pagination) {
        return {
            items: response.data,
            pagination: {
                page: 1,
                limit: response.data.length,
                total: response.data.length,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
            },
        };
    }
    return { items: response.data, pagination };
};
exports.unwrapPaginated = unwrapPaginated;
