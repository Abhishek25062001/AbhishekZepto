"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCheckoutStoreClosedError = exports.isCheckoutAddressUnserviceableError = exports.isCheckoutPriceChangedError = exports.isCheckoutStockUnavailableError = exports.isCheckoutCartEmptyError = exports.isCheckoutSessionExpiredError = exports.isCheckoutSessionNotFoundError = exports.getCheckoutErrorCode = exports.getCheckoutErrorMessage = void 0;
const ERROR_MESSAGES = {
    CHECKOUT_SESSION_NOT_FOUND: 'Checkout session not found.',
    CHECKOUT_SESSION_EXPIRED: 'Your reservation has expired. Please start checkout again.',
    CHECKOUT_CART_EMPTY: 'Your cart is empty.',
    CHECKOUT_STOCK_UNAVAILABLE: 'Some items are out of stock. Please update your cart.',
    CHECKOUT_PRICE_CHANGED: 'Prices have changed. Please go back to your cart and refresh.',
    CHECKOUT_ADDRESS_UNSERVICEABLE: 'This address is not serviceable for your store.',
    CHECKOUT_STORE_CLOSED: 'The store is not available for checkout right now.',
    ADDRESS_NOT_FOUND: 'Please add or select a delivery address.',
};
const getCheckoutErrorMessage = (error, fallback) => {
    const axiosError = error;
    const code = axiosError.response?.data?.error?.code;
    if (code && ERROR_MESSAGES[code]) {
        return ERROR_MESSAGES[code];
    }
    return axiosError.response?.data?.message ?? fallback;
};
exports.getCheckoutErrorMessage = getCheckoutErrorMessage;
const getCheckoutErrorCode = (error) => {
    const axiosError = error;
    return axiosError.response?.data?.error?.code;
};
exports.getCheckoutErrorCode = getCheckoutErrorCode;
const isCheckoutSessionNotFoundError = (error) => (0, exports.getCheckoutErrorCode)(error) === 'CHECKOUT_SESSION_NOT_FOUND';
exports.isCheckoutSessionNotFoundError = isCheckoutSessionNotFoundError;
const isCheckoutSessionExpiredError = (error) => (0, exports.getCheckoutErrorCode)(error) === 'CHECKOUT_SESSION_EXPIRED';
exports.isCheckoutSessionExpiredError = isCheckoutSessionExpiredError;
const isCheckoutCartEmptyError = (error) => (0, exports.getCheckoutErrorCode)(error) === 'CHECKOUT_CART_EMPTY';
exports.isCheckoutCartEmptyError = isCheckoutCartEmptyError;
const isCheckoutStockUnavailableError = (error) => (0, exports.getCheckoutErrorCode)(error) === 'CHECKOUT_STOCK_UNAVAILABLE';
exports.isCheckoutStockUnavailableError = isCheckoutStockUnavailableError;
const isCheckoutPriceChangedError = (error) => (0, exports.getCheckoutErrorCode)(error) === 'CHECKOUT_PRICE_CHANGED';
exports.isCheckoutPriceChangedError = isCheckoutPriceChangedError;
const isCheckoutAddressUnserviceableError = (error) => (0, exports.getCheckoutErrorCode)(error) === 'CHECKOUT_ADDRESS_UNSERVICEABLE';
exports.isCheckoutAddressUnserviceableError = isCheckoutAddressUnserviceableError;
const isCheckoutStoreClosedError = (error) => (0, exports.getCheckoutErrorCode)(error) === 'CHECKOUT_STORE_CLOSED';
exports.isCheckoutStoreClosedError = isCheckoutStoreClosedError;
