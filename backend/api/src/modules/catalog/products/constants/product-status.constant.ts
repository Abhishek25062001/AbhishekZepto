import { DB_STATUS } from '../../../../database/constants/db-status.constants';

export const PRODUCT_STATUS = {
  ACTIVE: DB_STATUS.ACTIVE,
  INACTIVE: DB_STATUS.INACTIVE,
  ARCHIVED: DB_STATUS.ARCHIVED,
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const PRODUCT_STATUS_VALUES = [
  PRODUCT_STATUS.ACTIVE,
  PRODUCT_STATUS.INACTIVE,
  PRODUCT_STATUS.ARCHIVED,
] as const;
