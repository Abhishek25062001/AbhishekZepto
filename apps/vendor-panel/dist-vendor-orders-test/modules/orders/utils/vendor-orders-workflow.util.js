"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canCancelVendorStoreOrder = exports.canMarkVendorOrderReadyForPickup = exports.canCompleteVendorOrderPacking = exports.canStartVendorOrderPacking = exports.canCompleteVendorOrderPicking = exports.isVendorOrderItemPickingResolved = exports.getVendorOrderItemRemainingQuantity = exports.canUpdateVendorOrderItemPicking = exports.canStartVendorOrderPicking = void 0;
const canStartVendorOrderPicking = (order) => order.orderStatus === 'accepted' &&
    order.storeStatus === 'accepted' &&
    (order.pickerStatus === null || order.pickerStatus === 'pending');
exports.canStartVendorOrderPicking = canStartVendorOrderPicking;
const canUpdateVendorOrderItemPicking = (order) => order.orderStatus === 'picking' &&
    order.storeStatus === 'accepted' &&
    order.pickerStatus === 'in_progress';
exports.canUpdateVendorOrderItemPicking = canUpdateVendorOrderItemPicking;
const getVendorOrderItemRemainingQuantity = (item) => Math.max(item.quantity - item.pickedQuantity - item.missingQuantity, 0);
exports.getVendorOrderItemRemainingQuantity = getVendorOrderItemRemainingQuantity;
const isVendorOrderItemPickingResolved = (item) => ['picked', 'missing', 'partial'].includes(item.pickingStatus);
exports.isVendorOrderItemPickingResolved = isVendorOrderItemPickingResolved;
const canCompleteVendorOrderPicking = (order) => (0, exports.canUpdateVendorOrderItemPicking)(order) &&
    order.items.length > 0 &&
    order.items.every(exports.isVendorOrderItemPickingResolved);
exports.canCompleteVendorOrderPicking = canCompleteVendorOrderPicking;
const canStartVendorOrderPacking = (order) => order.orderStatus === 'picking' &&
    order.storeStatus === 'accepted' &&
    order.pickerStatus === 'completed' &&
    order.packingStatus === null;
exports.canStartVendorOrderPacking = canStartVendorOrderPacking;
const canCompleteVendorOrderPacking = (order) => order.orderStatus === 'packing' &&
    order.storeStatus === 'accepted' &&
    order.packingStatus === 'in_progress';
exports.canCompleteVendorOrderPacking = canCompleteVendorOrderPacking;
const canMarkVendorOrderReadyForPickup = (order) => order.orderStatus === 'packing' &&
    order.storeStatus === 'accepted' &&
    order.packingStatus === 'completed';
exports.canMarkVendorOrderReadyForPickup = canMarkVendorOrderReadyForPickup;
const canCancelVendorStoreOrder = (order) => ['placed', 'accepted', 'picking', 'packing'].includes(order.orderStatus);
exports.canCancelVendorStoreOrder = canCancelVendorStoreOrder;
