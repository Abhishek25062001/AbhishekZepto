export const ADMIN_CONTROL_SESSION_TYPE = {
  MONITORING: 'monitoring',
  INCIDENT: 'incident',
  OVERRIDE: 'override',
} as const;

export const ADMIN_CONTROL_ACTIVE_MODULE = {
  LIVE_OVERVIEW: 'live_overview',
  LIVE_ORDERS: 'live_orders',
  LIVE_AGENTS: 'live_agents',
  LIVE_STORES: 'live_stores',
  ESCALATIONS: 'escalations',
  OVERRIDES: 'overrides',
} as const;

export const ADMIN_CONTROL_SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const ADMIN_CONTROL_SESSION_TYPES = Object.values(ADMIN_CONTROL_SESSION_TYPE);
export const ADMIN_CONTROL_ACTIVE_MODULES = Object.values(ADMIN_CONTROL_ACTIVE_MODULE);
