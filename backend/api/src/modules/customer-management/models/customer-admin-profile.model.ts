import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';

import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  CUSTOMER_RISK_STATUS,
  CUSTOMER_RISK_STATUSES,
} from '../constants/customer-management.constants';
import type { CustomerAdminProfileRecord } from '../types/customer-management.types';

const CustomerAdminProfileSchema = new Schema<CustomerAdminProfileRecord>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
    riskStatus: {
      type: String,
      enum: CUSTOMER_RISK_STATUSES,
      default: CUSTOMER_RISK_STATUS.NORMAL,
      index: true,
    },
    adminNotes: { type: String, default: null, trim: true },
    blockedAt: { type: Date, default: null },
    blockedBy: { type: Schema.Types.ObjectId, default: null },
    blockReason: { type: String, default: null, trim: true },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
  },
  baseSchemaOptions as SchemaOptions<CustomerAdminProfileRecord>,
);

CustomerAdminProfileSchema.index({ riskStatus: 1, updatedAt: -1 });

export const CustomerAdminProfileModel = model<CustomerAdminProfileRecord>(
  'CustomerAdminProfile',
  CustomerAdminProfileSchema,
  COLLECTION_NAMES.CUSTOMER_ADMIN_PROFILES,
);
