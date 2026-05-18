import { shouldRenderPermissionGatedContent } from '../../../access-control/permission-visibility.util';

export const canReadLocations = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'locations:read');

export const canCreateLocation = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'locations:create');

export const canUpdateLocation = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'locations:update');

export const canDeleteLocation = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'locations:delete');

export const canReadStores = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'stores:read');

export const canCreateStore = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'stores:create');

export const canUpdateStore = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'stores:update');

export const canDeleteStore = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'stores:delete');
