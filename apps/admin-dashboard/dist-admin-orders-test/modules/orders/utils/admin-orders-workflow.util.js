"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canShowAdminCancellationAction = exports.canShowAdminStatusUpdateAction = exports.getNextAdminOrderStatuses = void 0;
const NEXT_ADMIN_STATUSES = {
    placed: ['accepted'],
    accepted: ['picking'],
    picking: ['packing'],
    packing: ['ready_for_pickup'],
};
const ADMIN_CANCELLABLE_STATUSES = ['placed', 'accepted', 'picking', 'packing'];
const getNextAdminOrderStatuses = (status) => NEXT_ADMIN_STATUSES[status] ?? [];
exports.getNextAdminOrderStatuses = getNextAdminOrderStatuses;
const canShowAdminStatusUpdateAction = (order) => (0, exports.getNextAdminOrderStatuses)(order.orderStatus).length > 0;
exports.canShowAdminStatusUpdateAction = canShowAdminStatusUpdateAction;
const canShowAdminCancellationAction = (order) => ADMIN_CANCELLABLE_STATUSES.includes(order.orderStatus);
exports.canShowAdminCancellationAction = canShowAdminCancellationAction;
