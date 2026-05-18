import { DB_STATUS } from '../../../../database/constants/db-status.constants';

export const CATEGORY_STATUS = {
  ACTIVE: DB_STATUS.ACTIVE,
  INACTIVE: DB_STATUS.INACTIVE,
  ARCHIVED: DB_STATUS.ARCHIVED,
} as const;

export type CategoryStatus = (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];

export const CATEGORY_STATUS_VALUES = [
  CATEGORY_STATUS.ACTIVE,
  CATEGORY_STATUS.INACTIVE,
  CATEGORY_STATUS.ARCHIVED,
] as const;
