import type { Document, Model, Types } from 'mongoose';
import type { DeliverySlaStatus, DeliverySlaStage } from '../constants/delivery-sla.constant';

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
  enRouteToCustomerAt: Date | null;
  arrivedAtCustomerAt: Date | null;
  completedAt: Date | null;
  deliveredAt: Date | null;
  failedAt: Date | null;
  failureReason: string | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  timeline: IDeliveryTimelineEvent[];
  slaStatus: DeliverySlaStatus;
  slaBreachedStage: DeliverySlaStage | null;
  slaAssignmentDeadline: Date | null;
  slaPickupDeadline: Date | null;
  slaDropDeadline: Date | null;
  slaTotalDeadline: Date | null;
  slaBreachedAt: Date | null;
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
  enRouteToCustomerAt: string | null;
  arrivedAtCustomerAt: string | null;
  completedAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
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

// ---------------------------------------------------------------------------
// Module 15 — Admin Delivery Operations Types
// ---------------------------------------------------------------------------

/**
 * Projected list item returned by GET /api/v1/admin/deliveries.
 * Omits bulky fields (full timeline, customer data) for performance.
 */
export interface AdminDeliveryListItem {
  deliveryId: string;
  orderId: string;
  storeId: string;
  cityId: string;
  deliveryAgentId: string | null;
  deliveryStatus: DeliveryStatus;
  assignedAt: string | null;
  pickedUpAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  slaStatus: DeliverySlaStatus;
  slaBreachedStage: DeliverySlaStage | null;
  createdAt: string;
}

/**
 * Query filters and pagination for GET /api/v1/admin/deliveries.
 */
export interface AdminDeliveryListQuery {
  status?: DeliveryStatus;
  agentId?: string;
  storeId?: string;
  cityId?: string;
  slaStatus?: DeliverySlaStatus;
  page: number;
  limit: number;
}

/**
 * Request body for POST /api/v1/admin/deliveries/:deliveryId/override.
 * Admin may only override to 'cancelled' or 'failed'.
 */
export interface AdminDeliveryOverrideBody {
  targetStatus: 'cancelled' | 'failed';
  reason: string;
}

/**
 * Agent snapshot embedded in admin delivery detail response.
 */
export interface AdminAgentSnapshot {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string | null;
  profilePhotoUrl: string | null;
}

/**
 * Full delivery detail response for GET /api/v1/admin/deliveries/:deliveryId.
 * Extends the base DeliveryAssignmentResponse with an agent snapshot.
 */
export interface AdminDeliveryDetailResponse extends DeliveryAssignmentResponse {
  agentSnapshot: AdminAgentSnapshot | null;
  slaStatus: DeliverySlaStatus;
  slaBreachedStage: DeliverySlaStage | null;
  slaBreachedAt: string | null;
  slaAssignmentDeadline: string | null;
  slaPickupDeadline: string | null;
  slaDropDeadline: string | null;
  slaTotalDeadline: string | null;
}

