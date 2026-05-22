import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { writeAuditLog } from '../../audit';
import { INVENTORY_MOVEMENT_TYPE } from '../../inventory/movements/constants/inventory-movement-type.constant';
import { INVENTORY_REFERENCE_TYPE } from '../../inventory/movements/constants/inventory-reference-type.constant';
import { createInventoryMovement } from '../../inventory/movements/services/inventory-movement.service';
import {
  findInventoryStockByStoreProduct,
  updateInventoryStockById,
} from '../../inventory/repositories/inventory-stock.repository';
import { ORDER_AUDIT_EVENTS } from '../constants/order-audit-events.constant';
import { ORDER_ITEM_PICKING_STATUS } from '../constants/order-item-picking-status.constant';
import type {
  OrderInventoryAdjustmentInput,
  OrderInventoryAdjustmentItemResult,
  OrderInventoryAdjustmentResult,
} from '../types/order-inventory-adjustment.types';
import { orderItemOperationInvalidError } from '../utils/order-error.mapper';

const isResolvedPickingStatus = (status: string): boolean =>
  status === ORDER_ITEM_PICKING_STATUS.PICKED ||
  status === ORDER_ITEM_PICKING_STATUS.MISSING ||
  status === ORDER_ITEM_PICKING_STATUS.PARTIAL;

const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null =>
  value && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const buildItemReconciliation = (
  item: OrderInventoryAdjustmentInput['items'][number],
): OrderInventoryAdjustmentItemResult => {
  const pickedQuantity = item.pickedQuantity ?? 0;
  const missingQuantity = item.missingQuantity ?? 0;
  const resolvedQuantity = pickedQuantity + missingQuantity;

  if (!isResolvedPickingStatus(item.pickingStatus)) {
    throw orderItemOperationInvalidError({
      storeProductId: item.storeProductId.toString(),
      pickingStatus: item.pickingStatus,
      reason: 'inventory_adjustment_requires_resolved_picking_status',
    });
  }

  if (resolvedQuantity > item.quantity) {
    throw orderItemOperationInvalidError({
      storeProductId: item.storeProductId.toString(),
      pickedQuantity,
      missingQuantity,
      orderedQuantity: item.quantity,
      reason: 'resolved_quantity_exceeds_ordered_quantity',
    });
  }

  if (resolvedQuantity !== item.quantity) {
    throw orderItemOperationInvalidError({
      storeProductId: item.storeProductId.toString(),
      pickedQuantity,
      missingQuantity,
      orderedQuantity: item.quantity,
      reason: 'inventory_adjustment_requires_fully_resolved_quantities',
    });
  }

  return {
    storeProductId: item.storeProductId.toString(),
    productId: item.productId.toString(),
    variantId: item.variantId.toString(),
    orderedQuantity: item.quantity,
    pickedQuantity,
    missingQuantity,
    adjustmentQuantity: pickedQuantity,
    reason: 'picked_quantity_reconciliation',
    movementId: null,
  };
};

export const buildOrderInventoryReconciliation = (
  input: OrderInventoryAdjustmentInput,
): OrderInventoryAdjustmentResult => {
  const items = input.items.map(buildItemReconciliation);

  return {
    adjusted: false,
    adjustedItemCount: 0,
    items,
    auditMetadata: {
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      storeId: input.storeId.toString(),
      itemCount: items.length,
      pickedQuantity: items.reduce((sum, item) => sum + item.pickedQuantity, 0),
      missingQuantity: items.reduce((sum, item) => sum + item.missingQuantity, 0),
    },
  };
};

export const adjustOrderInventoryForMissingItems = async (
  input: OrderInventoryAdjustmentInput,
): Promise<OrderInventoryAdjustmentResult> => {
  const reconciliation = buildOrderInventoryReconciliation(input);
  const adjustedItems: OrderInventoryAdjustmentItemResult[] = [];

  for (const item of reconciliation.items) {
    if (item.missingQuantity <= 0) {
      adjustedItems.push(item);
      continue;
    }

    const stock = await findInventoryStockByStoreProduct(
      input.storeId.toString(),
      item.storeProductId,
    );

    if (!stock) {
      throw new AppError({
        message: 'Inventory stock not found',
        statusCode: HTTP_STATUS.NOT_FOUND,
        errorCode: ERROR_CODES.INVENTORY_STOCK_NOT_FOUND,
        details: {
          storeProductId: item.storeProductId,
          orderId: input.orderId,
        },
      });
    }

    const movement = await createInventoryMovement({
      storeId: stock.storeId.toString(),
      vendorId: stock.vendorId.toString(),
      cityId: stock.cityId.toString(),
      inventoryStockId: stock._id.toString(),
      storeProductId: stock.storeProductId.toString(),
      productId: stock.productId.toString(),
      variantId: stock.variantId.toString(),
      movementType: INVENTORY_MOVEMENT_TYPE.CORRECTION,
      quantity: item.missingQuantity,
      previousAvailableQuantity: stock.availableQuantity,
      newAvailableQuantity: stock.availableQuantity,
      previousReservedQuantity: stock.reservedQuantity,
      newReservedQuantity: stock.reservedQuantity,
      previousTotalQuantity: stock.totalQuantity,
      newTotalQuantity: stock.totalQuantity,
      reason: 'Missing item reconciliation during picking',
      referenceType: INVENTORY_REFERENCE_TYPE.ORDER,
      referenceId: input.orderId,
      notes: null,
      createdBy: input.actor.userId,
      metadata: {
        orderNumber: input.orderNumber,
        storeProductId: item.storeProductId,
        productId: item.productId,
        variantId: item.variantId,
        orderedQuantity: item.orderedQuantity,
        pickedQuantity: item.pickedQuantity,
        missingQuantity: item.missingQuantity,
      },
    });

    await updateInventoryStockById(stock._id.toString(), {
      lastStockUpdatedAt: new Date(),
      lastStockMovementId: new Types.ObjectId(movement.id),
      updatedBy: toObjectIdOrNull(input.actor.userId),
    });

    adjustedItems.push({
      ...item,
      adjustmentQuantity: item.missingQuantity,
      reason: 'missing_item',
      movementId: movement.id,
    });
  }

  const missingAdjustedItems = adjustedItems.filter((item) => item.missingQuantity > 0);

  if (missingAdjustedItems.length > 0) {
    await writeAuditLog({
      eventType: ORDER_AUDIT_EVENTS.INVENTORY_ADJUSTED,
      actorId: toObjectIdOrNull(input.actor.userId),
      actorRole: input.actor.role,
      actorSurface: 'vendor_panel',
      entityType: 'order',
      entityId: new Types.ObjectId(input.orderId),
      vendorId: toObjectIdOrNull(input.actor.vendorId),
      storeId: input.storeId,
      cityId: null,
      requestId: input.actor.requestId,
      traceId: input.actor.traceId,
      ipAddress: input.actor.ipAddress ?? null,
      userAgent: input.actor.userAgent ?? null,
      metadata: {
        ...reconciliation.auditMetadata,
        adjustedItemCount: missingAdjustedItems.length,
        items: missingAdjustedItems,
      },
      status: 'success',
    });
  }

  return {
    adjusted: missingAdjustedItems.length > 0,
    adjustedItemCount: missingAdjustedItems.length,
    items: adjustedItems,
    auditMetadata: {
      ...reconciliation.auditMetadata,
      adjustedItemCount: missingAdjustedItems.length,
    },
  };
};
