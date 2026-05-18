import type { PermissionCode } from './auth-permission.types';
import type { AuthRole } from './auth-role.types';
import type { ResolvedAuthScope } from './auth-scope.types';

export type AuthUserContext = ResolvedAuthScope & {
  userId: string;
  role: AuthRole;
  permissions: PermissionCode[];
  sessionId: string;
};
