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
