import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { FULFILLMENT_TYPE_VALUES } from '../constants/fulfillment-type.constant';
import { STORE_STATUS_VALUES } from '../constants/store-status.constant';
import { STORE_TYPE_VALUES } from '../constants/store-type.constant';

export type StoreRecord = {
  vendorId: Types.ObjectId;
  cityId: Types.ObjectId;
  serviceAreaIds: Types.ObjectId[];
  name: string;
  slug: string;
  code: string;
  description: string | null;
  phone: string;
  email: string | null;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  pincode: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  openingTime: string;
  closingTime: string;
  operatingDays: string[];
  isOpen: boolean;
  isAcceptingOrders: boolean;
  temporaryClosureReason: string | null;
  storeType: (typeof STORE_TYPE_VALUES)[number];
  fulfillmentType: (typeof FULFILLMENT_TYPE_VALUES)[number];
  status: (typeof STORE_STATUS_VALUES)[number];
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

const StoreSchema = new Schema<StoreRecord>(
  {
    vendorId: { type: Schema.Types.ObjectId, required: true },
    cityId: { type: Schema.Types.ObjectId, required: true, ref: 'City' },
    serviceAreaIds: { type: [Schema.Types.ObjectId], default: [] },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, default: null, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: null, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, default: null, trim: true },
    landmark: { type: String, default: null, trim: true },
    pincode: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    serviceRadiusKm: { type: Number, required: true },
    openingTime: { type: String, required: true, trim: true },
    closingTime: { type: String, required: true, trim: true },
    operatingDays: { type: [String], default: [] },
    isOpen: { type: Boolean, default: true },
    isAcceptingOrders: { type: Boolean, default: true },
    temporaryClosureReason: { type: String, default: null, trim: true },
    storeType: { type: String, enum: STORE_TYPE_VALUES, required: true },
    fulfillmentType: { type: String, enum: FULFILLMENT_TYPE_VALUES, required: true },
    status: { type: String, enum: STORE_STATUS_VALUES, default: 'active' },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<StoreRecord>,
);

StoreSchema.index(
  { cityId: 1, slug: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
StoreSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
StoreSchema.index({ vendorId: 1 });
StoreSchema.index({ cityId: 1 });
StoreSchema.index({ serviceAreaIds: 1 });
StoreSchema.index({ status: 1 });
StoreSchema.index({ isOpen: 1 });
StoreSchema.index({ isAcceptingOrders: 1 });
StoreSchema.index({ storeType: 1 });
StoreSchema.index({ fulfillmentType: 1 });

export const StoreModel = model<StoreRecord>('Store', StoreSchema, COLLECTION_NAMES.STORES);
