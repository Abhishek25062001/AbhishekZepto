import { shouldRenderPermissionGatedContent } from '../../../access-control/permission-visibility.util';

export const canReadCatalog = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'catalog:read');

export const canReadStoreProducts = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'store_products:read');

export const canUpdateStoreProducts = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'store_products:update');
