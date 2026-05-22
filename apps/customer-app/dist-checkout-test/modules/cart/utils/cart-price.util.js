"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCartGrandTotal = exports.formatCartLineTotal = void 0;
const catalog_price_util_1 = require("../../catalog/utils/catalog-price.util");
const formatCartLineTotal = (amount) => (0, catalog_price_util_1.formatProductPrice)(amount);
exports.formatCartLineTotal = formatCartLineTotal;
const formatCartGrandTotal = (amount) => (0, catalog_price_util_1.formatProductPrice)(amount);
exports.formatCartGrandTotal = formatCartGrandTotal;
