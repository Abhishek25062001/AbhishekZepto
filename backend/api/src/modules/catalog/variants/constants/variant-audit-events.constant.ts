export const VARIANT_AUDIT_EVENTS = {
  VARIANT_CREATED: 'catalog.variant_created',
  VARIANT_UPDATED: 'catalog.variant_updated',
  VARIANT_DELETED: 'catalog.variant_deleted',
} as const;

export type VariantAuditEvent = (typeof VARIANT_AUDIT_EVENTS)[keyof typeof VARIANT_AUDIT_EVENTS];
