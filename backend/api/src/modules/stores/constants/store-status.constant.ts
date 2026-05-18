export const STORE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  ARCHIVED: 'archived',
} as const;

export const STORE_STATUS_VALUES = [
  STORE_STATUS.ACTIVE,
  STORE_STATUS.INACTIVE,
  STORE_STATUS.SUSPENDED,
  STORE_STATUS.ARCHIVED,
] as const;

export type StoreStatus = (typeof STORE_STATUS_VALUES)[number];
