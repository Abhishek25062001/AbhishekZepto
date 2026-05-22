import { shouldRenderPermissionGatedContent } from '../../../access-control/permission-visibility.util';
import type { VendorOrderDetail } from '../types/vendor-orders.types';
import {
  canCompleteVendorOrderPacking,
  canCompleteVendorOrderPicking,
  canMarkVendorOrderReadyForPickup,
  canCancelVendorStoreOrder,
  canStartVendorOrderPacking,
  canStartVendorOrderPicking,
  canUpdateVendorOrderItemPicking,
} from './vendor-orders-workflow.util';

export const canReadVendorOrders = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'orders:read');

export const canUpdateVendorOrders = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'orders:update');

export const canReadVendorActiveOrders = canReadVendorOrders;

export const canUpdateVendorPickingPacking = canUpdateVendorOrders;

export const canReadVendorOrderHistory = canReadVendorOrders;

export const canUpdateVendorOrderHistory = canUpdateVendorOrders;

export const canShowStartPickingAction = (
  permissions: readonly string[],
  order: VendorOrderDetail,
) => canUpdateVendorPickingPacking(permissions) && canStartVendorOrderPicking(order);

export const canShowItemPickingActions = (
  permissions: readonly string[],
  order: VendorOrderDetail,
) => canUpdateVendorPickingPacking(permissions) && canUpdateVendorOrderItemPicking(order);

export const canShowCompletePickingAction = (
  permissions: readonly string[],
  order: VendorOrderDetail,
) => canUpdateVendorPickingPacking(permissions) && canCompleteVendorOrderPicking(order);

export const canShowStartPackingAction = (
  permissions: readonly string[],
  order: VendorOrderDetail,
) => canUpdateVendorPickingPacking(permissions) && canStartVendorOrderPacking(order);

export const canShowCompletePackingAction = (
  permissions: readonly string[],
  order: VendorOrderDetail,
) => canUpdateVendorPickingPacking(permissions) && canCompleteVendorOrderPacking(order);

export const canShowReadyForPickupAction = (
  permissions: readonly string[],
  order: VendorOrderDetail,
) => canUpdateVendorPickingPacking(permissions) && canMarkVendorOrderReadyForPickup(order);

export const canShowStoreCancellationAction = (
  permissions: readonly string[],
  order: VendorOrderDetail,
) => canUpdateVendorOrderHistory(permissions) && canCancelVendorStoreOrder(order);
