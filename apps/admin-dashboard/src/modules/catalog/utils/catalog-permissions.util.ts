import { shouldRenderPermissionGatedContent } from '../../../access-control/permission-visibility.util';

export const canReadCatalog = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'catalog:read');

export const canCreateCatalog = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'catalog:create');

export const canUpdateCatalog = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'catalog:update');

export const canDeleteCatalog = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'catalog:delete');

export const canApproveCatalog = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'catalog:approve');

export const canUploadMedia = (permissions: readonly string[]) =>
  shouldRenderPermissionGatedContent(permissions, 'media:upload');
