import { shouldRenderPermissionGatedContent } from '../../../access-control/permission-visibility.util';

export const canReadInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:read');

export const canUpdateInventory = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'inventory:update');
