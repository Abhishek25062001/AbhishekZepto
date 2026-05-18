export const PRODUCT_TYPE = {
  SIMPLE: 'simple',
  VARIANT: 'variant',
  BUNDLE_PLACEHOLDER: 'bundle_placeholder',
} as const;

export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  simple: 'Simple',
  variant: 'Variant',
  bundle_placeholder: 'Bundle placeholder',
};

export const FOOD_TYPE = {
  VEG: 'veg',
  NON_VEG: 'non_veg',
  EGG: 'egg',
  NOT_APPLICABLE: 'not_applicable',
} as const;

export type FoodType = (typeof FOOD_TYPE)[keyof typeof FOOD_TYPE];

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  veg: 'Veg',
  non_veg: 'Non-veg',
  egg: 'Egg',
  not_applicable: 'Not applicable',
};

export const PRODUCT_APPROVAL_STATUS = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
} as const;

export type ProductApprovalStatus =
  (typeof PRODUCT_APPROVAL_STATUS)[keyof typeof PRODUCT_APPROVAL_STATUS];

export const PRODUCT_APPROVAL_STATUS_LABELS: Record<ProductApprovalStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
  archived: 'Archived',
};
