import type {
  DeliveryAgentAvailabilityStatus,
  DeliveryAgentManagementStatus,
  DeliveryAgentVerificationStatus,
} from '../types/admin-delivery-agents.types';

export const DELIVERY_AGENT_STATUS_OPTIONS: Array<{
  label: string;
  value: DeliveryAgentManagementStatus;
}> = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export const DELIVERY_AGENT_AVAILABILITY_OPTIONS: Array<{
  label: string;
  value: DeliveryAgentAvailabilityStatus;
}> = [
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
];

export const DELIVERY_AGENT_VERIFICATION_OPTIONS: Array<{
  label: string;
  value: DeliveryAgentVerificationStatus;
}> = [
  { label: 'Verified', value: 'verified' },
  { label: 'Unverified', value: 'unverified' },
];

export const DELIVERY_ASSIGNMENT_STATUS_OPTIONS = [
  { label: 'Pending Assignment', value: 'pending_assignment' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'En Route To Store', value: 'en_route_to_store' },
  { label: 'Arrived At Store', value: 'arrived_at_store' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'En Route To Customer', value: 'en_route_to_customer' },
  { label: 'Arrived At Customer', value: 'arrived_at_customer' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
] as const;
