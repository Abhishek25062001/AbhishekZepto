import type { AvailabilityStatus, VehicleType } from '../types/delivery-agent.types';

/** All allowed vehicle types for a delivery agent. */
export const VEHICLE_TYPE: Record<Uppercase<VehicleType>, VehicleType> = Object.freeze({
  BIKE: 'bike',
  SCOOTER: 'scooter',
  BICYCLE: 'bicycle',
  FOOT: 'foot',
});

export const VEHICLE_TYPE_VALUES = Object.values(VEHICLE_TYPE) as [VehicleType, ...VehicleType[]];

/** All allowed availability status values for a delivery agent. */
export const AVAILABILITY_STATUS: Record<Uppercase<AvailabilityStatus>, AvailabilityStatus> =
  Object.freeze({
    OFFLINE: 'offline',
    ONLINE: 'online',
  });

export const AVAILABILITY_STATUS_VALUES = Object.values(AVAILABILITY_STATUS) as [
  AvailabilityStatus,
  ...AvailabilityStatus[],
];

/** MongoDB collection name for delivery agents. */
export const DELIVERY_AGENT_COLLECTION = 'delivery_agents' as const;
