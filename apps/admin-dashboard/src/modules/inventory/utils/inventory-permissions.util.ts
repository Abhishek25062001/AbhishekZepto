import { shouldRenderPermissionGatedContent } from '../../../access-control/permission-visibility.util';

export const canReadStoreProducts = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'store_products:read');

export const canCreateStoreProduct = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'store_products:create');

export const canUpdateStoreProduct = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'store_products:update');

export const canDeleteStoreProduct = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'store_products:delete');

export const canBulkUpdateStoreProducts = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'store_products:bulk_update');

export const canReadInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:read');

export const canCreateInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:create');

export const canUpdateInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:update');

export const canDeleteInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:delete');

export const canAdjustInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:adjust');

export const canBulkUpdateInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:bulk_update');
