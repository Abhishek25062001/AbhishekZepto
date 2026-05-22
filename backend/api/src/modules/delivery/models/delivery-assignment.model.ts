import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { DELIVERY_STATUS_VALUES } from '../constants/delivery-status.constant';
import type { IDeliveryAssignmentDocument, IDeliveryAssignmentModel } from '../types/delivery-assignment.types';

const DeliveryTimelineEventSchema = new Schema(
  {
    actorType: {
      type: String,
      enum: ['system', 'delivery_agent', 'admin'],
      required: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    fromStatus: {
      type: String,
      required: true,
    },
    toStatus: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false },
);

const DeliveryAssignmentSchema = new Schema<IDeliveryAssignmentDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    deliveryAgentId: {
      type: Schema.Types.ObjectId,
      ref: 'DeliveryAgent',
      default: null,
    },
    deliveryStatus: {
      type: String,
      enum: DELIVERY_STATUS_VALUES,
      required: true,
      default: 'pending_assignment',
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    arrivedAtStoreAt: {
      type: Date,
      default: null,
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    timeline: {
      type: [DeliveryTimelineEventSchema],
      default: [],
    },
  },
  baseSchemaOptions as SchemaOptions<IDeliveryAssignmentDocument>,
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

// Unique index on orderId
DeliveryAssignmentSchema.index({ orderId: 1 }, { unique: true });

// Index for query by deliveryAgentId and status (finding active/past agent assignments)
DeliveryAssignmentSchema.index({ deliveryAgentId: 1, deliveryStatus: 1 });

// Index for unassigned/pending deliveries in a city
DeliveryAssignmentSchema.index({ cityId: 1, deliveryStatus: 1 });

// Index for general admin lists sorted by creation date
DeliveryAssignmentSchema.index({ createdAt: -1 });

// ---------------------------------------------------------------------------
// Model export
// ---------------------------------------------------------------------------

export const DeliveryAssignmentModel = model<IDeliveryAssignmentDocument, IDeliveryAssignmentModel>(
  'DeliveryAssignment',
  DeliveryAssignmentSchema,
  COLLECTION_NAMES.DELIVERIES,
);

export { DeliveryAssignmentSchema };
