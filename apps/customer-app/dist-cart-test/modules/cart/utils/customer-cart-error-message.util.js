"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCartPriceChangedError = exports.isCartNotFoundError = exports.getCustomerCartErrorCode = exports.getCustomerCartErrorMessage = void 0;
const ERROR_MESSAGES = {
    CART_NOT_FOUND: 'Your cart is empty.',
    CART_ITEM_NOT_FOUND: 'This item is no longer in your cart.',
    CART_PRODUCT_UNAVAILABLE: 'This product is not available at your store.',
    CART_INSUFFICIENT_STOCK: 'Not enough stock for this quantity.',
    CART_MAX_QUANTITY_EXCEEDED: 'Maximum quantity per item reached.',
    CART_STORE_MISMATCH: 'Store changed. Please refresh or reselect your store.',
    CART_PRICE_CHANGED: 'Prices have changed. Tap refresh to update your cart.',
    STORE_NOT_FOUND: 'Store not found.',
};
const getCustomerCartErrorMessage = (error, fallback) => {
    const axiosError = error;
    const code = axiosError.response?.data?.error?.code;
    if (code && ERROR_MESSAGES[code]) {
        return ERROR_MESSAGES[code];
    }
    return axiosError.response?.data?.message ?? fallback;
};
exports.getCustomerCartErrorMessage = getCustomerCartErrorMessage;
const getCustomerCartErrorCode = (error) => {
    const axiosError = error;
    return axiosError.response?.data?.error?.code;
};
exports.getCustomerCartErrorCode = getCustomerCartErrorCode;
const isCartNotFoundError = (error) => (0, exports.getCustomerCartErrorCode)(error) === 'CART_NOT_FOUND';
exports.isCartNotFoundError = isCartNotFoundError;
const isCartPriceChangedError = (error) => (0, exports.getCustomerCartErrorCode)(error) === 'CART_PRICE_CHANGED';
exports.isCartPriceChangedError = isCartPriceChangedError;
