export type PermissionResource =
  | 'auth'
  | 'customer'
  | 'users'
  | 'catalog'
  | 'media'
  | 'inventory'
  | 'locations'
  | 'store_products'
  | 'orders'
  | 'delivery'
  | 'vendor'
  | 'stores'
  | 'payments'
  | 'finance'
  | 'support'
  | 'settings';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'manage'
  | 'adjust'
  | 'bulk_update'
  | 'read_self'
  | 'read_store';

export type PermissionCode = `${PermissionResource}:${PermissionAction}` | '*:*';
