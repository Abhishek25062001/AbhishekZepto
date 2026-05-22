import type { Types } from 'mongoose';
import type { StoreOrderActorContext } from './order.types';

export type OrderInventoryAdjustmentReason =
  | 'picked_quantity_reconciliation'
  | 'missing_item';

export type OrderInventoryAdjustmentItemResult = {
  storeProductId: string;
  productId: string;
  variantId: string;
  orderedQuantity: number;
  pickedQuantity: number;
  missingQuantity: number;
  adjustmentQuantity: number;
  reason: OrderInventoryAdjustmentReason;
  movementId: string | null;
};

export type OrderInventoryAdjustmentInput = {
  orderId: string;
  orderNumber: string;
  storeId: Types.ObjectId;
  items: Array<{
    storeProductId: Types.ObjectId;
    productId: Types.ObjectId;
    variantId: Types.ObjectId;
    quantity: number;
    pickedQuantity: number;
    missingQuantity: number;
    pickingStatus: string;
  }>;
  actor: StoreOrderActorContext;
};

export type OrderInventoryAdjustmentResult = {
  adjusted: boolean;
  adjustedItemCount: number;
  items: OrderInventoryAdjustmentItemResult[];
  auditMetadata: Record<string, unknown>;
};
