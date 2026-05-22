import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';

export type CustomerStoreSelectionRecord = {
  customerId: Types.ObjectId;
  addressId: Types.ObjectId;
  storeId: Types.ObjectId;
  isSelected: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const CustomerStoreSelectionSchema = new Schema<CustomerStoreSelectionRecord>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    addressId: { type: Schema.Types.ObjectId, required: true },
    storeId: { type: Schema.Types.ObjectId, required: true, ref: 'Store' },
    isSelected: { type: Boolean, required: true, default: true },
  },
  baseSchemaOptions as SchemaOptions<CustomerStoreSelectionRecord>,
);

CustomerStoreSelectionSchema.index(
  { customerId: 1, isSelected: 1 },
  {
    name: 'customer_store_selections_selected',
    partialFilterExpression: { isSelected: true },
    unique: true,
  },
);

export const CustomerStoreSelectionModel = model<CustomerStoreSelectionRecord>(
  COLLECTION_NAMES.CUSTOMER_STORE_SELECTIONS,
  CustomerStoreSelectionSchema,
);
