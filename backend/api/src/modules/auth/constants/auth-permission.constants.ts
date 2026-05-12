export const AUTH_PERMISSION_RESOURCE = {
  AUTH: 'auth',
  USERS: 'users',
  CATALOG: 'catalog',
  INVENTORY: 'inventory',
  ORDERS: 'orders',
  DELIVERY: 'delivery',
  PAYMENTS: 'payments',
  SETTINGS: 'settings',
} as const;

export const AUTH_PERMISSION_ACTION = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  MANAGE: 'manage',
} as const;

export const WILDCARD_PERMISSION = '*:*';
