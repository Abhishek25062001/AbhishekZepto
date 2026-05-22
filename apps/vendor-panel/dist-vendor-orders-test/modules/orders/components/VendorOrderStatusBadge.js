"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorOrderStatusBadge = VendorOrderStatusBadge;
exports.VendorStoreStatusBadge = VendorStoreStatusBadge;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_1 = require("../../../components/common");
const ORDER_STATUS_LABELS = {
    accepted: 'Accepted',
    cancelled: 'Cancelled',
    packing: 'Packing',
    picking: 'Picking',
    placed: 'Placed',
    ready_for_pickup: 'Ready',
};
const STORE_STATUS_LABELS = {
    accepted: 'Accepted',
    pending_acceptance: 'Pending',
    rejected: 'Rejected',
};
function VendorOrderStatusBadge({ status }) {
    const variant = status === 'cancelled' ? 'error' : status === 'placed' ? 'warning' : 'success';
    return (0, jsx_runtime_1.jsx)(common_1.Badge, { variant: variant, children: ORDER_STATUS_LABELS[status] });
}
function VendorStoreStatusBadge({ status }) {
    const variant = status === 'rejected' ? 'error' : status === 'pending_acceptance' ? 'warning' : 'success';
    return (0, jsx_runtime_1.jsx)(common_1.Badge, { variant: variant, children: STORE_STATUS_LABELS[status] });
}
