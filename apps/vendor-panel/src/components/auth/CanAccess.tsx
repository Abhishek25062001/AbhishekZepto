import type { ReactNode } from 'react';

import { useAuthStore } from '../../store/auth.store';
import { hasPermission } from '../../utils/permission.util';

type CanAccessProps = {
  children: ReactNode;
  fallback?: ReactNode;
  permission: string;
};

export function CanAccess({ children, fallback = null, permission }: CanAccessProps) {
  const permissions = useAuthStore((state) => state.permissions);

  if (!hasPermission(permissions, permission)) {
    return fallback;
  }

  return children;
}
