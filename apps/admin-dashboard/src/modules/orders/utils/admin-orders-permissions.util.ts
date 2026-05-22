const hasPermission = (permissions: readonly string[], permission: string): boolean =>
  permissions.includes('*:*') || permissions.includes(permission);

export const canReadAdminOrders = (permissions: readonly string[]): boolean =>
  hasPermission(permissions, 'orders:read');

export const canUpdateAdminOrderStatus = (permissions: readonly string[]): boolean =>
  hasPermission(permissions, 'orders:update-status');

export const canCancelAdminOrder = (permissions: readonly string[]): boolean =>
  hasPermission(permissions, 'orders:cancel');

export const canMonitorAdminOrderSla = (permissions: readonly string[]): boolean =>
  hasPermission(permissions, 'orders:monitor-sla');
