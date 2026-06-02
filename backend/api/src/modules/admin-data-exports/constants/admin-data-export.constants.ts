export const ADMIN_DATA_EXPORT_TYPE = {
  ADMIN_USERS: 'admin_users',
  CUSTOMERS: 'customers',
  DELIVERY_AGENTS: 'delivery_agents',
  VENDORS: 'vendors',
  STORES: 'stores',
  SUPPORT_TICKETS: 'support_tickets',
  AUDIT_LOGS: 'audit_logs',
  OPERATIONAL_ANALYTICS: 'operational_analytics',
  PLATFORM_SETTINGS: 'platform_settings',
} as const;

export const ADMIN_DATA_EXPORT_TYPES = Object.values(ADMIN_DATA_EXPORT_TYPE);

export const ADMIN_DATA_EXPORT_FORMAT = {
  CSV: 'csv',
  JSON: 'json',
} as const;

export const ADMIN_DATA_EXPORT_FORMATS = Object.values(ADMIN_DATA_EXPORT_FORMAT);

export const ADMIN_DATA_EXPORT_STATUS = {
  QUEUED: 'queued',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const ADMIN_DATA_EXPORT_STATUSES = Object.values(ADMIN_DATA_EXPORT_STATUS);
