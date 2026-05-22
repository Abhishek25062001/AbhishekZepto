import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  CUSTOMER_ADDRESS_STATUS_VALUES,
  type CustomerAddressStatus,
} from '../constants/customer-address-status.constant';

export type CustomerAddressRecord = {
  customerId: Types.ObjectId;
  label: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  cityId: Types.ObjectId | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  status: CustomerAddressStatus;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const CustomerAddressSchema = new Schema<CustomerAddressRecord>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    label: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, default: null, trim: true },
    landmark: { type: String, default: null, trim: true },
    city: { type: String, required: true, trim: true },
    cityId: { type: Schema.Types.ObjectId, default: null, ref: 'City' },
    state: { type: String, default: null, trim: true },
    postalCode: { type: String, default: null, trim: true },
    country: { type: String, required: true, trim: true, default: 'IN' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    isDefault: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: CUSTOMER_ADDRESS_STATUS_VALUES,
      default: 'active',
    },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<CustomerAddressRecord>,
);

CustomerAddressSchema.index(
  { customerId: 1, isDeleted: 1 },
  { name: 'customer_addresses_customer' },
);

CustomerAddressSchema.index(
  { customerId: 1, isDefault: 1 },
  {
    name: 'customer_addresses_default',
    partialFilterExpression: { isDefault: true, isDeleted: false },
  },
);

export const CustomerAddressModel = model<CustomerAddressRecord>(
  COLLECTION_NAMES.CUSTOMER_ADDRESSES,
  CustomerAddressSchema,
);
