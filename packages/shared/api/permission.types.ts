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
  | 'push_notifications'
  | 'notifications'
  | 'realtime_control_tower'
  | 'settings';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'manage'
  | 'cancel'
  | 'update-status'
  | 'adjust'
  | 'bulk_update'
  | 'read_self'
  | 'update_self'
  | 'read_store'
  | 'monitor';

export type PermissionCode = `${PermissionResource}:${PermissionAction}` | '*:*';
