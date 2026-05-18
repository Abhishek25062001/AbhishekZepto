import type { ReactNode } from 'react';
import type { PermissionCode } from '../../../../../packages/shared/api';

import { shouldRenderPermissionGatedContent } from '../../access-control/permission-visibility.util';
import { useAuthStore } from '../../store/auth.store';

type CanAccessProps = {
  children: ReactNode;
  fallback?: ReactNode;
  permission: PermissionCode;
};

export function CanAccess({ children, fallback = null, permission }: CanAccessProps) {
  const permissions = useAuthStore((state) => state.permissions);

  if (!shouldRenderPermissionGatedContent(permissions, permission)) {
    return fallback;
  }

  return children;
}
