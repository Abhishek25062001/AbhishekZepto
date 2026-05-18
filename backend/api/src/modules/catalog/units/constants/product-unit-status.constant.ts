import { DB_STATUS } from '../../../../database/constants/db-status.constants';

export const PRODUCT_UNIT_STATUS = {
  ACTIVE: DB_STATUS.ACTIVE,
  INACTIVE: DB_STATUS.INACTIVE,
  ARCHIVED: DB_STATUS.ARCHIVED,
} as const;

export type ProductUnitStatus =
  (typeof PRODUCT_UNIT_STATUS)[keyof typeof PRODUCT_UNIT_STATUS];

export const PRODUCT_UNIT_STATUS_VALUES = [
  PRODUCT_UNIT_STATUS.ACTIVE,
  PRODUCT_UNIT_STATUS.INACTIVE,
  PRODUCT_UNIT_STATUS.ARCHIVED,
] as const;
