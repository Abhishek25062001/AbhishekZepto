export const CITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export const CITY_STATUS_VALUES = [
  CITY_STATUS.ACTIVE,
  CITY_STATUS.INACTIVE,
  CITY_STATUS.ARCHIVED,
] as const;

export type CityStatus = (typeof CITY_STATUS_VALUES)[number];
