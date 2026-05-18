export const SERVICE_AREA_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export const SERVICE_AREA_STATUS_VALUES = [
  SERVICE_AREA_STATUS.ACTIVE,
  SERVICE_AREA_STATUS.INACTIVE,
  SERVICE_AREA_STATUS.ARCHIVED,
] as const;

export type ServiceAreaStatus = (typeof SERVICE_AREA_STATUS_VALUES)[number];
