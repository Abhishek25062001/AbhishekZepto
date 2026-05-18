export const VARIANT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export const VARIANT_STATUS_VALUES = [
  VARIANT_STATUS.ACTIVE,
  VARIANT_STATUS.INACTIVE,
  VARIANT_STATUS.ARCHIVED,
] as const;

export type VariantStatus = (typeof VARIANT_STATUS_VALUES)[number];
