import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { DELIVERY_STATUS_VALUES } from '../constants/delivery-status.constant';
import {
  DELIVERY_SLA_STATUS,
  DELIVERY_SLA_STATUS_VALUES,
  DELIVERY_SLA_STAGE_VALUES,
} from '../constants/delivery-sla.constant';
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
    assignmentSource: {
      type: String,
      default: null,
      trim: true,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    unassignedReason: {
      type: String,
      default: null,
      trim: true,
    },
    unassignedAt: {
      type: Date,
      default: null,
    },
    unassignedBy: {
      type: Schema.Types.ObjectId,
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
    enRouteToCustomerAt: {
      type: Date,
      default: null,
    },
    arrivedAtCustomerAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
      trim: true,
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
    slaStatus: {
      type: String,
      enum: DELIVERY_SLA_STATUS_VALUES,
      required: true,
      default: DELIVERY_SLA_STATUS.NOT_STARTED,
    },
    slaBreachedStage: {
      type: String,
      enum: DELIVERY_SLA_STAGE_VALUES,
      default: null,
    },
    slaAssignmentDeadline: {
      type: Date,
      default: null,
    },
    slaPickupDeadline: {
      type: Date,
      default: null,
    },
    slaDropDeadline: {
      type: Date,
      default: null,
    },
    slaTotalDeadline: {
      type: Date,
      default: null,
    },
    slaBreachedAt: {
      type: Date,
      default: null,
    },
    escalationLevel: {
      type: Number,
      default: null,
      min: 0,
    },
    escalatedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    escalatedAt: {
      type: Date,
      default: null,
    },
    escalationReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  baseSchemaOptions as SchemaOptions<IDeliveryAssignmentDocument>,
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

// Unique index on orderId
DeliveryAssignmentSchema.index({ orderId: 1 }, { unique: true });

// SLA evaluation query: find active deliveries needing evaluation
DeliveryAssignmentSchema.index({ slaStatus: 1 }, { sparse: true });

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
