import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  AVAILABILITY_STATUS,
  AVAILABILITY_STATUS_VALUES,
  VEHICLE_TYPE_VALUES,
} from '../constants/delivery-agent-status.constant';
import type { IDeliveryAgentDocument, IDeliveryAgentModel } from '../types/delivery-agent.types';

const DeliveryAgentSchema = new Schema<IDeliveryAgentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    profilePhotoUrl: {
      type: String,
      default: null,
    },
    vehicleType: {
      type: String,
      enum: VEHICLE_TYPE_VALUES,
      required: true,
    },
    vehicleNumber: {
      type: String,
      default: null,
      trim: true,
    },
    availabilityStatus: {
      type: String,
      enum: AVAILABILITY_STATUS_VALUES,
      required: true,
      default: AVAILABILITY_STATUS.OFFLINE,
    },
    forcedOfflineAt: {
      type: Date,
      default: null,
    },
    forcedOfflineReason: {
      type: String,
      default: null,
      trim: true,
    },
    forcedOfflineBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    currentAssignmentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    totalDeliveries: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  baseSchemaOptions as SchemaOptions<IDeliveryAgentDocument>,
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

// Identity indexes (unique)
DeliveryAgentSchema.index({ userId: 1 }, { unique: true });
DeliveryAgentSchema.index({ phone: 1 }, { unique: true });

// Assignment dispatch query — find online agents in a city (Module 4)
DeliveryAgentSchema.index({ availabilityStatus: 1, cityId: 1 });

// Availability list query filter
DeliveryAgentSchema.index({ isDeleted: 1, isActive: 1, availabilityStatus: 1 });

// Admin list sort (newest first)
DeliveryAgentSchema.index({ createdAt: -1 });

// ---------------------------------------------------------------------------
// Model export
// ---------------------------------------------------------------------------

export const DeliveryAgentModel = model<IDeliveryAgentDocument, IDeliveryAgentModel>(
  'DeliveryAgent',
  DeliveryAgentSchema,
  COLLECTION_NAMES.DELIVERY_AGENTS,
);

export { DeliveryAgentSchema };
