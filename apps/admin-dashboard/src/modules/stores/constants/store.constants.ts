export const LOCATION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type LocationStatus = (typeof LOCATION_STATUS)[keyof typeof LOCATION_STATUS];

export const LOCATION_STATUS_LABELS: Record<LocationStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export const STORE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
} as const;

export type StoreStatus = (typeof STORE_STATUS)[keyof typeof STORE_STATUS];

export const STORE_STATUS_LABELS: Record<StoreStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  archived: 'Archived',
};

export const STORE_TYPE = {
  GROCERY: 'grocery',
  PHARMACY: 'pharmacy',
  RESTAURANT: 'restaurant',
  GENERAL: 'general',
  DARK_STORE: 'dark_store',
} as const;

export type StoreType = (typeof STORE_TYPE)[keyof typeof STORE_TYPE];

export const STORE_TYPE_LABELS: Record<StoreType, string> = {
  grocery: 'Grocery',
  pharmacy: 'Pharmacy',
  restaurant: 'Restaurant',
  general: 'General',
  dark_store: 'Dark store',
};

export const FULFILLMENT_TYPE = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  DELIVERY_AND_PICKUP: 'delivery_and_pickup',
} as const;

export type FulfillmentType = (typeof FULFILLMENT_TYPE)[keyof typeof FULFILLMENT_TYPE];

export const FULFILLMENT_TYPE_LABELS: Record<FulfillmentType, string> = {
  delivery: 'Delivery',
  pickup: 'Pickup',
  delivery_and_pickup: 'Delivery & pickup',
};
