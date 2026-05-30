export type AvailabilityStatus = 'offline' | 'online' | 'busy';

export interface DeliveryAgentProfile {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  email: string | null;
  profilePhotoUrl: string | null;
  vehicleType: 'bike' | 'scooter' | 'bicycle' | 'foot';
  vehicleNumber: string | null;
  availabilityStatus: 'offline' | 'online';
  isVerified: boolean;
  isActive: boolean;
  cityId: string | null;
  currentAssignmentId: string | null;
  totalDeliveries: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAgentStatus {
  availabilityStatus: 'offline' | 'online' | 'busy';
  currentAssignmentId: string | null;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string | null;
  profilePhotoUrl?: string | null;
  vehicleType?: 'bike' | 'scooter' | 'bicycle' | 'foot';
  vehicleNumber?: string | null;
}

// ---------------------------------------------------------------------------
// Delivery Assignment Types (Module 7 — Pickup Flow)
// ---------------------------------------------------------------------------

export type DeliveryStatus =
  | 'pending_assignment'
  | 'assigned'
  | 'en_route_to_store'
  | 'arrived_at_store'
  | 'picked_up'
  | 'en_route_to_customer'
  | 'arrived_at_customer'
  | 'delivered'
  | 'failed'
  | 'cancelled';

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
  createdAt: string;
  updatedAt: string;
}

export interface PickupVerificationPayload {
  verificationMethod?: 'otp' | 'barcode' | 'manual';
  verificationValue?: string;
  notes?: string;
}

export interface DeliveryCompletionPayload {
  verificationMethod?: 'otp' | 'photo' | 'manual';
  verificationValue?: string;
  notes?: string;
}

export interface DeliveryFailurePayload {
  failureReason: string;
}

