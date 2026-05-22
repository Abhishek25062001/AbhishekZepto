"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyCart = exports.getCartItemCount = void 0;
const getCartItemCount = (cart) => cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
exports.getCartItemCount = getCartItemCount;
const createEmptyCart = (storeId) => ({
    id: '',
    storeId,
    status: 'active',
    currency: 'INR',
    items: [],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    deliveryFeeAmount: 0,
    grandTotal: 0,
});
exports.createEmptyCart = createEmptyCart;
