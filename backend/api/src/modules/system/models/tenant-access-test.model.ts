import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';

export type TenantAccessTestRecord = {
  vendorId: Types.ObjectId | null;
  storeId: Types.ObjectId | null;
  cityId: Types.ObjectId | null;
  customerId: Types.ObjectId | null;
  deliveryAgentId: Types.ObjectId | null;
  label: string;
  status: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const TenantAccessTestSchema = new Schema<TenantAccessTestRecord>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    deliveryAgentId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    ...baseSchemaFields,
  },
  baseSchemaOptions as SchemaOptions<TenantAccessTestRecord>,
);

TenantAccessTestSchema.index({ vendorId: 1, storeId: 1, isDeleted: 1 });
TenantAccessTestSchema.index({ customerId: 1, isDeleted: 1 });
TenantAccessTestSchema.index({ deliveryAgentId: 1, isDeleted: 1 });

export const TenantAccessTestModel = model<TenantAccessTestRecord>(
  'TenantAccessTest',
  TenantAccessTestSchema,
  COLLECTION_NAMES.TENANT_ACCESS_TESTS,
);
