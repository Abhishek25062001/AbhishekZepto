export const STORE_AUDIT_EVENTS = {
  STORE_CREATED: 'store.created',
  STORE_UPDATED: 'store.updated',
  STORE_DELETED: 'store.deleted',
  STORE_OPEN_STATUS_CHANGED: 'store.open_status_changed',
  STORE_ORDER_ACCEPTANCE_CHANGED: 'store.order_acceptance_changed',
} as const;

export type StoreAuditEvent = (typeof STORE_AUDIT_EVENTS)[keyof typeof STORE_AUDIT_EVENTS];
