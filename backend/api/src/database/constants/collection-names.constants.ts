export const COLLECTION_NAMES = {
  USERS: 'users',
  USER_IDENTITIES: 'user_identities',
  AUTH_SESSIONS: 'auth_sessions',
  ROLES: 'roles',
  CUSTOMERS: 'customers',
  DELIVERY_AGENTS: 'delivery_agents',
  VENDOR_USERS: 'vendor_users',
  ADMINS: 'admins',
  STORES: 'stores',
  PRODUCTS: 'products',
  PRODUCT_VARIANTS: 'product_variants',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  INVENTORIES: 'inventories',
  ORDERS: 'orders',
  DELIVERIES: 'deliveries',
  AUDIT_LOGS: 'audit_logs',
  SYSTEM_CHECKS: 'system_checks',
} as const;

export type CollectionName = (typeof COLLECTION_NAMES)[keyof typeof COLLECTION_NAMES];
