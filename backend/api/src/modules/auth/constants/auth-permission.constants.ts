export const AUTH_PERMISSION_RESOURCE = {
  AUTH: 'auth',
  CUSTOMER: 'customer',
  USERS: 'users',
  CATALOG: 'catalog',
  INVENTORY: 'inventory',
  MEDIA: 'media',
  ORDERS: 'orders',
  DELIVERY: 'delivery',
  VENDOR: 'vendor',
  LOCATIONS: 'locations',
  STORES: 'stores',
  STORE_PRODUCTS: 'store_products',
  PAYMENTS: 'payments',
  FINANCE: 'finance',
  SUPPORT: 'support',
  SETTINGS: 'settings',
} as const;

export const AUTH_PERMISSION_ACTION = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  MANAGE: 'manage',
  READ_SELF: 'read_self',
  READ_STORE: 'read_store',
  BULK_UPDATE: 'bulk_update',
  ADJUST: 'adjust',
  UPLOAD: 'upload',
} as const;

export const WILDCARD_PERMISSION = '*:*';
