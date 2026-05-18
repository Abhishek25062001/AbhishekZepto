import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import { INVENTORY_MOVEMENT_TYPE_VALUES } from '../constants/inventory-movement-type.constant';
import { INVENTORY_REFERENCE_TYPE_VALUES } from '../constants/inventory-reference-type.constant';

export type InventoryMovementRecord = {
  storeId: Types.ObjectId;
  vendorId: Types.ObjectId;
  cityId: Types.ObjectId;
  inventoryStockId: Types.ObjectId;
  storeProductId: Types.ObjectId;
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  movementType: (typeof INVENTORY_MOVEMENT_TYPE_VALUES)[number];
  quantity: number;
  previousAvailableQuantity: number;
  newAvailableQuantity: number;
  previousReservedQuantity: number;
  newReservedQuantity: number;
  previousTotalQuantity: number;
  newTotalQuantity: number;
  reason: string;
  referenceType: (typeof INVENTORY_REFERENCE_TYPE_VALUES)[number];
  referenceId: string | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const InventoryMovementSchema = new Schema<InventoryMovementRecord>(
  {
    storeId: { type: Schema.Types.ObjectId, required: true },
    vendorId: { type: Schema.Types.ObjectId, required: true },
    cityId: { type: Schema.Types.ObjectId, required: true },
    inventoryStockId: { type: Schema.Types.ObjectId, required: true, ref: 'InventoryStock' },
    storeProductId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    movementType: { type: String, enum: INVENTORY_MOVEMENT_TYPE_VALUES, required: true },
    quantity: { type: Number, required: true },
    previousAvailableQuantity: { type: Number, required: true },
    newAvailableQuantity: { type: Number, required: true },
    previousReservedQuantity: { type: Number, required: true },
    newReservedQuantity: { type: Number, required: true },
    previousTotalQuantity: { type: Number, required: true },
    newTotalQuantity: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    referenceType: { type: String, enum: INVENTORY_REFERENCE_TYPE_VALUES, required: true },
    referenceId: { type: String, default: null, trim: true },
    notes: { type: String, default: null, trim: true },
    metadata: { type: Schema.Types.Mixed, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
  },
  baseSchemaOptions as SchemaOptions<InventoryMovementRecord>,
);

InventoryMovementSchema.index({ storeId: 1 });
InventoryMovementSchema.index({ vendorId: 1 });
InventoryMovementSchema.index({ cityId: 1 });
InventoryMovementSchema.index({ inventoryStockId: 1 });
InventoryMovementSchema.index({ storeProductId: 1 });
InventoryMovementSchema.index({ productId: 1 });
InventoryMovementSchema.index({ variantId: 1 });
InventoryMovementSchema.index({ movementType: 1 });
InventoryMovementSchema.index({ referenceType: 1 });
InventoryMovementSchema.index({ referenceId: 1 });
InventoryMovementSchema.index({ createdAt: -1 });

export const InventoryMovementModel = model<InventoryMovementRecord>(
  'InventoryMovement',
  InventoryMovementSchema,
  COLLECTION_NAMES.INVENTORY_MOVEMENTS,
);
