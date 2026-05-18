export const STORE_PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type StoreProductStatus =
  (typeof STORE_PRODUCT_STATUS)[keyof typeof STORE_PRODUCT_STATUS];

export const STORE_PRODUCT_STATUS_VALUES = [
  STORE_PRODUCT_STATUS.ACTIVE,
  STORE_PRODUCT_STATUS.INACTIVE,
  STORE_PRODUCT_STATUS.ARCHIVED,
] as const;
