import type { ReactNode } from 'react';
import type { PermissionCode } from '../../../../../packages/shared/api';

import { shouldRenderAnyPermissionGatedContent } from '../../access-control/permission-visibility.util';
import { useAuthStore } from '../../store/auth.store';

type CanAccessAnyProps = {
  children: ReactNode;
  fallback?: ReactNode;
  permissions: readonly PermissionCode[];
};

export function CanAccessAny({
  children,
  fallback = null,
  permissions,
}: CanAccessAnyProps) {
  const userPermissions = useAuthStore((state) => state.permissions);

  if (!shouldRenderAnyPermissionGatedContent(userPermissions, permissions)) {
    return fallback;
  }

  return children;
}
