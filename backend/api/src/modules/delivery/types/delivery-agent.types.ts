import type { Document, Model, Types } from 'mongoose';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const VehicleType = {
  BIKE: 'bike',
  SCOOTER: 'scooter',
  BICYCLE: 'bicycle',
  FOOT: 'foot',
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export const AvailabilityStatus = {
  OFFLINE: 'offline',
  ONLINE: 'online',
} as const;

export type AvailabilityStatus = (typeof AvailabilityStatus)[keyof typeof AvailabilityStatus];

// ---------------------------------------------------------------------------
// Base document interface
// ---------------------------------------------------------------------------

export interface IDeliveryAgentBase {
  userId: Types.ObjectId;
  name: string;
  phone: string;
  email: string | null;
  profilePhotoUrl: string | null;
  vehicleType: VehicleType;
  vehicleNumber: string | null;
  availabilityStatus: AvailabilityStatus;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  cityId: Types.ObjectId | null;
  currentAssignmentId: Types.ObjectId | null;
  totalDeliveries: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Mongoose Document and Model types
// ---------------------------------------------------------------------------

export interface IDeliveryAgentDocument extends IDeliveryAgentBase, Document {
  _id: Types.ObjectId;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeliveryAgentModel extends Model<IDeliveryAgentDocument> {}

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

/** Fields required when creating a new delivery agent record. */
export interface CreateDeliveryAgentDto {
  userId: Types.ObjectId;
  name: string;
  phone: string;
  email?: string | null;
  profilePhotoUrl?: string | null;
  vehicleType: VehicleType;
  vehicleNumber?: string | null;
  cityId?: Types.ObjectId | null;
}

/**
 * Mutable profile fields an agent can update via
 * PATCH /api/v1/delivery/profile.
 * All fields are optional — send only what you want to change.
 *
 * NOT allowed: availabilityStatus, userId, phone, isVerified, isActive.
 */
export interface UpdateDeliveryAgentProfileDto {
  name?: string;
  email?: string | null;
  profilePhotoUrl?: string | null;
  vehicleType?: VehicleType;
  vehicleNumber?: string | null;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/** Public profile response — delivered to the agent themselves. */
export interface DeliveryAgentProfileResponse {
  agentId: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  profilePhotoUrl: string | null;
  vehicleType: VehicleType;
  vehicleNumber: string | null;
  availabilityStatus: AvailabilityStatus;
  cityId: string | null;
  currentAssignmentId: string | null;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
}

/** Admin-facing response — includes verification and account flags. */
export interface AdminDeliveryAgentResponse extends DeliveryAgentProfileResponse {
  isVerified: boolean;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Query filter types
// ---------------------------------------------------------------------------

export interface AdminAgentListFilters {
  isActive?: boolean;
  availabilityStatus?: string;
  cityId?: string;
  page: number;
  limit: number;
}
