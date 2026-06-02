"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const catalog_error_message_util_1 = require("./catalog-error-message.util");
(0, node_test_1.test)('mapCatalogErrorCodeToMessage prefers catalog dictionary entries', () => {
    strict_1.default.equal((0, catalog_error_message_util_1.mapCatalogErrorCodeToMessage)('PRODUCT_NOT_FOUND', 'fallback'), 'Product not found.');
    strict_1.default.equal((0, catalog_error_message_util_1.mapCatalogErrorCodeToMessage)('UNKNOWN_CODE', 'fallback'), 'fallback');
});
(0, node_test_1.test)('mapCatalogErrorCodeToMessage normalizes dotted error codes', () => {
    strict_1.default.equal((0, catalog_error_message_util_1.mapCatalogErrorCodeToMessage)('domain.error.PRODUCT_SLUG_ALREADY_EXISTS', 'fallback'), 'A product with this slug already exists.');
});
(0, node_test_1.test)('extractApiErrorCode reads axios-like error payloads', () => {
    const error = {
        response: {
            data: {
                error: { code: 'CATEGORY_NOT_FOUND' },
            },
        },
    };
    strict_1.default.equal((0, catalog_error_message_util_1.extractApiErrorCode)(error), 'CATEGORY_NOT_FOUND');
    strict_1.default.equal((0, catalog_error_message_util_1.extractApiErrorCode)(new Error('nope')), undefined);
});
