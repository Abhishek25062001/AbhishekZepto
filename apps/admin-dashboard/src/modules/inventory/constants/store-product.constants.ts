export const STORE_PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type StoreProductStatus = (typeof STORE_PRODUCT_STATUS)[keyof typeof STORE_PRODUCT_STATUS];

export const STORE_PRODUCT_STATUS_LABELS: Record<StoreProductStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

export const DISCOUNT_TYPE = {
  NONE: 'none',
  FLAT: 'flat',
  PERCENTAGE: 'percentage',
} as const;

export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  none: 'None',
  flat: 'Flat',
  percentage: 'Percentage',
};
