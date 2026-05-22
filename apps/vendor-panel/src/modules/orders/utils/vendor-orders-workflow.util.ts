import type { VendorOrderDetail } from '../types/vendor-orders.types';

type WorkflowOrder = Pick<
  VendorOrderDetail,
  'orderStatus' | 'storeStatus' | 'pickerStatus'
> & Partial<Pick<VendorOrderDetail, 'packingStatus'>>;

type WorkflowOrderWithItems = WorkflowOrder & Pick<VendorOrderDetail, 'items'>;

type WorkflowItem = Pick<
  VendorOrderDetail['items'][number],
  'missingQuantity' | 'pickedQuantity' | 'quantity'
>;

export const canStartVendorOrderPicking = (order: WorkflowOrder) =>
  order.orderStatus === 'accepted' &&
  order.storeStatus === 'accepted' &&
  (order.pickerStatus === null || order.pickerStatus === 'pending');

export const canUpdateVendorOrderItemPicking = (order: WorkflowOrder) =>
  order.orderStatus === 'picking' &&
  order.storeStatus === 'accepted' &&
  order.pickerStatus === 'in_progress';

export const getVendorOrderItemRemainingQuantity = (item: WorkflowItem) =>
  Math.max(item.quantity - item.pickedQuantity - item.missingQuantity, 0);

export const isVendorOrderItemPickingResolved = (
  item: Pick<VendorOrderDetail['items'][number], 'pickingStatus'>,
) => ['picked', 'missing', 'partial'].includes(item.pickingStatus);

export const canCompleteVendorOrderPicking = (order: WorkflowOrderWithItems) =>
  canUpdateVendorOrderItemPicking(order) &&
  order.items.length > 0 &&
  order.items.every(isVendorOrderItemPickingResolved);

export const canStartVendorOrderPacking = (order: WorkflowOrder) =>
  order.orderStatus === 'picking' &&
  order.storeStatus === 'accepted' &&
  order.pickerStatus === 'completed' &&
  order.packingStatus === null;

export const canCompleteVendorOrderPacking = (order: WorkflowOrder) =>
  order.orderStatus === 'packing' &&
  order.storeStatus === 'accepted' &&
  order.packingStatus === 'in_progress';

export const canMarkVendorOrderReadyForPickup = (order: WorkflowOrder) =>
  order.orderStatus === 'packing' &&
  order.storeStatus === 'accepted' &&
  order.packingStatus === 'completed';

export const canCancelVendorStoreOrder = (order: WorkflowOrder) =>
  ['placed', 'accepted', 'picking', 'packing'].includes(order.orderStatus);
