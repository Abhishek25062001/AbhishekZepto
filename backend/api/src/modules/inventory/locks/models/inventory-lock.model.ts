import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import { INVENTORY_LOCK_STATUS_VALUES } from '../constants/inventory-lock-status.constant';
import { INVENTORY_LOCK_TYPE_VALUES } from '../constants/inventory-lock-type.constant';

export type InventoryLockRecord = {
  storeId: Types.ObjectId;
  vendorId: Types.ObjectId;
  cityId: Types.ObjectId;
  inventoryStockId: Types.ObjectId;
  storeProductId: Types.ObjectId;
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  customerId: Types.ObjectId | null;
  cartId: Types.ObjectId | null;
  orderId: Types.ObjectId | null;
  lockToken: string;
  lockType: (typeof INVENTORY_LOCK_TYPE_VALUES)[number];
  quantity: number;
  status: (typeof INVENTORY_LOCK_STATUS_VALUES)[number];
  expiresAt: Date;
  releasedAt: Date | null;
  confirmedAt: Date | null;
  releaseReason: string | null;
  confirmationReason: string | null;
  metadata: Record<string, unknown> | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const InventoryLockSchema = new Schema<InventoryLockRecord>(
  {
    storeId: { type: Schema.Types.ObjectId, required: true },
    vendorId: { type: Schema.Types.ObjectId, required: true },
    cityId: { type: Schema.Types.ObjectId, required: true },
    inventoryStockId: { type: Schema.Types.ObjectId, required: true },
    storeProductId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    customerId: { type: Schema.Types.ObjectId, default: null },
    cartId: { type: Schema.Types.ObjectId, default: null },
    orderId: { type: Schema.Types.ObjectId, default: null },
    lockToken: { type: String, required: true, trim: true },
    lockType: { type: String, enum: INVENTORY_LOCK_TYPE_VALUES, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: INVENTORY_LOCK_STATUS_VALUES, default: 'active' },
    expiresAt: { type: Date, required: true },
    releasedAt: { type: Date, default: null },
    confirmedAt: { type: Date, default: null },
    releaseReason: { type: String, default: null, trim: true },
    confirmationReason: { type: String, default: null, trim: true },
    metadata: { type: Schema.Types.Mixed, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
  },
  baseSchemaOptions as SchemaOptions<InventoryLockRecord>,
);

InventoryLockSchema.index(
  { lockToken: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } },
);
InventoryLockSchema.index({ storeId: 1 });
InventoryLockSchema.index({ vendorId: 1 });
InventoryLockSchema.index({ cityId: 1 });
InventoryLockSchema.index({ inventoryStockId: 1 });
InventoryLockSchema.index({ storeProductId: 1 });
InventoryLockSchema.index({ productId: 1 });
InventoryLockSchema.index({ variantId: 1 });
InventoryLockSchema.index({ customerId: 1 });
InventoryLockSchema.index({ cartId: 1 });
InventoryLockSchema.index({ orderId: 1 });
InventoryLockSchema.index({ status: 1 });
InventoryLockSchema.index({ createdAt: -1 });
InventoryLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const InventoryLockModel = model<InventoryLockRecord>(
  'InventoryLock',
  InventoryLockSchema,
  COLLECTION_NAMES.INVENTORY_LOCKS,
);
