import { DB_STATUS } from '../../../../database/constants/db-status.constants';

export const BRAND_STATUS = {
  ACTIVE: DB_STATUS.ACTIVE,
  INACTIVE: DB_STATUS.INACTIVE,
  ARCHIVED: DB_STATUS.ARCHIVED,
} as const;

export type BrandStatus = (typeof BRAND_STATUS)[keyof typeof BRAND_STATUS];

export const BRAND_STATUS_VALUES = [
  BRAND_STATUS.ACTIVE,
  BRAND_STATUS.INACTIVE,
  BRAND_STATUS.ARCHIVED,
] as const;
