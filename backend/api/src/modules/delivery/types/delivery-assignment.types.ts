import type { Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums & Types
// ---------------------------------------------------------------------------

export const DeliveryStatus = {
  PENDING_ASSIGNMENT: 'pending_assignment',
  ASSIGNED: 'assigned',
  EN_ROUTE_TO_STORE: 'en_route_to_store',
  ARRIVED_AT_STORE: 'arrived_at_store',
  PICKED_UP: 'picked_up',
  EN_ROUTE_TO_CUSTOMER: 'en_route_to_customer',
  ARRIVED_AT_CUSTOMER: 'arrived_at_customer',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type DeliveryStatus = (typeof DeliveryStatus)[keyof typeof DeliveryStatus];

export type DeliveryActorType = 'system' | 'delivery_agent' | 'admin';

export interface IDeliveryTimelineEvent {
  actorType: DeliveryActorType;
  actorId: Types.ObjectId | null;
  fromStatus: string;
  toStatus: string;
  reason?: string | null;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Base Delivery Assignment Interface
// ---------------------------------------------------------------------------

export interface IDeliveryAssignmentBase {
  orderId: Types.ObjectId;
  customerId: Types.ObjectId;
  storeId: Types.ObjectId;
  cityId: Types.ObjectId;
  deliveryAgentId: Types.ObjectId | null;
  deliveryStatus: DeliveryStatus;
  assignedAt: Date | null;
  arrivedAtStoreAt: Date | null;
  pickedUpAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  timeline: IDeliveryTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Mongoose Document and Model
// ---------------------------------------------------------------------------

export interface IDeliveryAssignmentDocument extends IDeliveryAssignmentBase, Document {
  _id: Types.ObjectId;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeliveryAssignmentModel extends Model<IDeliveryAssignmentDocument> {}

// ---------------------------------------------------------------------------
// DTOs & Responses
// ---------------------------------------------------------------------------

export interface CreateDeliveryAssignmentDto {
  orderId: Types.ObjectId;
  customerId: Types.ObjectId;
  storeId: Types.ObjectId;
  cityId: Types.ObjectId;
}

export interface DeliveryAssignmentResponse {
  deliveryId: string;
  orderId: string;
  customerId: string;
  storeId: string;
  cityId: string;
  deliveryAgentId: string | null;
  deliveryStatus: DeliveryStatus;
  assignedAt: string | null;
  arrivedAtStoreAt: string | null;
  pickedUpAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  timeline: Array<{
    actorType: DeliveryActorType;
    actorId: string | null;
    fromStatus: string;
    toStatus: string;
    reason?: string | null;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface IPickupVerificationData {
  verificationMethod?: 'otp' | 'barcode' | 'manual';
  verificationValue?: string;
  notes?: string;
}

