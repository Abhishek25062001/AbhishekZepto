export const CITY_AUDIT_EVENTS = {
  CITY_CREATED: 'location.city_created',
  CITY_UPDATED: 'location.city_updated',
  CITY_DELETED: 'location.city_deleted',
} as const;

export type CityAuditEvent = (typeof CITY_AUDIT_EVENTS)[keyof typeof CITY_AUDIT_EVENTS];
