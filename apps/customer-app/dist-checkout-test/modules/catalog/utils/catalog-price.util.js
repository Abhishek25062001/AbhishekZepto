"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldStrikeMrp = exports.shouldShowDiscount = exports.calculateDiscountPercentage = exports.formatProductPrice = void 0;
const formatProductPrice = (amount) => {
    return `₹${amount.toFixed(2)}`;
};
exports.formatProductPrice = formatProductPrice;
const calculateDiscountPercentage = (mrp, finalPrice) => {
    if (mrp <= 0 || finalPrice >= mrp) {
        return 0;
    }
    return Math.round(((mrp - finalPrice) / mrp) * 100);
};
exports.calculateDiscountPercentage = calculateDiscountPercentage;
const shouldShowDiscount = (mrp, finalPrice) => {
    if (mrp == null || finalPrice == null) {
        return false;
    }
    return finalPrice < mrp;
};
exports.shouldShowDiscount = shouldShowDiscount;
exports.shouldStrikeMrp = exports.shouldShowDiscount;
