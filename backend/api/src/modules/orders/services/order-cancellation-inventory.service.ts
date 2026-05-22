import { Types } from 'mongoose';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { INVENTORY_MOVEMENT_TYPE } from '../../inventory/movements/constants/inventory-movement-type.constant';
import { INVENTORY_REFERENCE_TYPE } from '../../inventory/movements/constants/inventory-reference-type.constant';
import { createInventoryMovement } from '../../inventory/movements/services/inventory-movement.service';
import type { InventoryStockRecord } from '../../inventory/models/inventory-stock.model';
import {
  findInventoryStockByStoreProduct,
  updateInventoryStockById,
} from '../../inventory/repositories/inventory-stock.repository';
import { calculateStockFlags, calculateTotalQuantity } from '../../inventory/utils/inventory-quantity.util';
import { ORDER_STATUS } from '../constants/order-status.constant';
import type { OrderRecord, StoreOrderActorContext } from '../types/order.types';
import { adjustOrderInventoryForMissingItems } from './order-inventory-adjustment.service';

type OrderWithId = OrderRecord & { _id: Types.ObjectId };

export type CancellationInventoryResult = {
  movementCount: number;
  restockedQuantity: number;
  reconciledMissingItems: boolean;
};

const toObjectIdOrNull = (value?: string | null): Types.ObjectId | null =>
  value && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null;

const loadStockForOrderItem = async (
  order: OrderWithId,
  storeProductId: string,
): Promise<InventoryStockRecord & { _id: Types.ObjectId }> => {
  const stock = await findInventoryStockByStoreProduct(order.storeId.toString(), storeProductId);

  if (!stock) {
    throw new AppError({
      message: 'Inventory stock not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
      errorCode: ERROR_CODES.INVENTORY_STOCK_NOT_FOUND,
      details: {
        orderId: order._id.toString(),
        storeProductId,
      },
    });
  }

  return stock;
};

const restockOrderItemQuantity = async ({
  actor,
  order,
  quantity,
  reason,
  stock,
}: {
  actor: StoreOrderActorContext;
  order: OrderWithId;
  quantity: number;
  reason: string;
  stock: InventoryStockRecord & { _id: Types.ObjectId };
}): Promise<void> => {
  if (quantity <= 0) {
    return;
  }

  const availableQuantity = stock.availableQuantity + quantity;
  const totalQuantity = calculateTotalQuantity(
    availableQuantity,
    stock.reservedQuantity,
    stock.damagedQuantity,
    stock.expiredQuantity,
  );
  const flags = calculateStockFlags(availableQuantity, stock.lowStockThreshold);
  const movement = await createInventoryMovement({
    storeId: stock.storeId.toString(),
    vendorId: stock.vendorId.toString(),
    cityId: stock.cityId.toString(),
    inventoryStockId: stock._id.toString(),
    storeProductId: stock.storeProductId.toString(),
    productId: stock.productId.toString(),
    variantId: stock.variantId.toString(),
    movementType: INVENTORY_MOVEMENT_TYPE.STOCK_IN,
    quantity,
    previousAvailableQuantity: stock.availableQuantity,
    newAvailableQuantity: availableQuantity,
    previousReservedQuantity: stock.reservedQuantity,
    newReservedQuantity: stock.reservedQuantity,
    previousTotalQuantity: stock.totalQuantity,
    newTotalQuantity: totalQuantity,
    reason,
    referenceType: INVENTORY_REFERENCE_TYPE.ORDER,
    referenceId: order._id.toString(),
    notes: null,
    createdBy: actor.userId,
    metadata: {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
    },
  });

  await updateInventoryStockById(stock._id.toString(), {
    availableQuantity,
    totalQuantity,
    isLowStock: flags.isLowStock,
    isOutOfStock: flags.isOutOfStock,
    lastStockUpdatedAt: new Date(),
    lastStockMovementId: new Types.ObjectId(movement.id),
    updatedBy: toObjectIdOrNull(actor.userId),
  });
};

const isPreparationStarted = (orderStatus: OrderRecord['orderStatus']): boolean =>
  orderStatus === ORDER_STATUS.PICKING || orderStatus === ORDER_STATUS.PACKING;

export const applyCancellationInventoryImpact = async (
  order: OrderWithId,
  actor: StoreOrderActorContext,
): Promise<CancellationInventoryResult> => {
  let movementCount = 0;
  let restockedQuantity = 0;
  let reconciledMissingItems = false;

  if (isPreparationStarted(order.orderStatus)) {
    const adjustment = await adjustOrderInventoryForMissingItems({
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      storeId: order.storeId,
      items: order.items,
      actor,
    });
    reconciledMissingItems = adjustment.adjusted;
  }

  for (const item of order.items) {
    const quantity = isPreparationStarted(order.orderStatus)
      ? item.pickedQuantity ?? 0
      : item.quantity;

    if (quantity <= 0) {
      continue;
    }

    const stock = await loadStockForOrderItem(order, item.storeProductId.toString());

    await restockOrderItemQuantity({
      actor,
      order,
      quantity,
      reason: isPreparationStarted(order.orderStatus)
        ? 'Order cancellation restocked picked quantity'
        : 'Order cancellation released allocated inventory',
      stock,
    });

    movementCount += 1;
    restockedQuantity += quantity;
  }

  return {
    movementCount,
    restockedQuantity,
    reconciledMissingItems,
  };
};
