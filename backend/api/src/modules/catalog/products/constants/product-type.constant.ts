export const PRODUCT_TYPE = {
  SIMPLE: 'simple',
  VARIANT: 'variant',
  BUNDLE_PLACEHOLDER: 'bundle_placeholder',
} as const;

export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

export const PRODUCT_TYPE_VALUES = [
  PRODUCT_TYPE.SIMPLE,
  PRODUCT_TYPE.VARIANT,
  PRODUCT_TYPE.BUNDLE_PLACEHOLDER,
] as const;
