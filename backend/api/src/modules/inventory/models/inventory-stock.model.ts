import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { INVENTORY_STOCK_STATUS_VALUES } from '../constants/inventory-stock-status.constant';

export type InventoryStockRecord = {
  storeId: Types.ObjectId;
  vendorId: Types.ObjectId;
  cityId: Types.ObjectId;
  storeProductId: Types.ObjectId;
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  sku: string;
  storeSku: string | null;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  expiredQuantity: number;
  totalQuantity: number;
  lowStockThreshold: number;
  reorderLevel: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  lastStockUpdatedAt: Date | null;
  lastStockMovementId: Types.ObjectId | null;
  status: (typeof INVENTORY_STOCK_STATUS_VALUES)[number];
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const InventoryStockSchema = new Schema<InventoryStockRecord>(
  {
    storeId: { type: Schema.Types.ObjectId, required: true, ref: 'Store' },
    vendorId: { type: Schema.Types.ObjectId, required: true },
    cityId: { type: Schema.Types.ObjectId, required: true },
    storeProductId: { type: Schema.Types.ObjectId, required: true, ref: 'StoreProduct' },
    productId: { type: Schema.Types.ObjectId, required: true },
    variantId: { type: Schema.Types.ObjectId, required: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    storeSku: { type: String, default: null, trim: true },
    availableQuantity: { type: Number, required: true, min: 0 },
    reservedQuantity: { type: Number, default: 0, min: 0 },
    damagedQuantity: { type: Number, default: 0, min: 0 },
    expiredQuantity: { type: Number, default: 0, min: 0 },
    totalQuantity: { type: Number, required: true, min: 0 },
    lowStockThreshold: { type: Number, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 0, min: 0 },
    isLowStock: { type: Boolean, default: false },
    isOutOfStock: { type: Boolean, default: false },
    lastStockUpdatedAt: { type: Date, default: null },
    lastStockMovementId: { type: Schema.Types.ObjectId, default: null },
    status: { type: String, enum: INVENTORY_STOCK_STATUS_VALUES, default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<InventoryStockRecord>,
);

InventoryStockSchema.index(
  { storeId: 1, storeProductId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
InventoryStockSchema.index({ storeId: 1 });
InventoryStockSchema.index({ vendorId: 1 });
InventoryStockSchema.index({ cityId: 1 });
InventoryStockSchema.index({ storeProductId: 1 });
InventoryStockSchema.index({ productId: 1 });
InventoryStockSchema.index({ variantId: 1 });
InventoryStockSchema.index({ sku: 1 });
InventoryStockSchema.index({ isLowStock: 1 });
InventoryStockSchema.index({ isOutOfStock: 1 });
InventoryStockSchema.index({ status: 1 });
InventoryStockSchema.index({ isDeleted: 1 });
InventoryStockSchema.index({ createdAt: -1 });
InventoryStockSchema.index(
  { storeProductId: 1, status: 1, isOutOfStock: 1 },
);
InventoryStockSchema.index(
  { cityId: 1, status: 1, isOutOfStock: 1 },
);

export const InventoryStockModel = model<InventoryStockRecord>(
  'InventoryStock',
  InventoryStockSchema,
  COLLECTION_NAMES.INVENTORY_STOCKS,
);
