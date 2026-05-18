export const SERVICE_AREA_AUDIT_EVENTS = {
  SERVICE_AREA_CREATED: 'location.service_area_created',
  SERVICE_AREA_UPDATED: 'location.service_area_updated',
  SERVICE_AREA_DELETED: 'location.service_area_deleted',
} as const;

export type ServiceAreaAuditEvent =
  (typeof SERVICE_AREA_AUDIT_EVENTS)[keyof typeof SERVICE_AREA_AUDIT_EVENTS];
