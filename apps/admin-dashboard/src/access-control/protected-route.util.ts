const adminAuthRoles = ['support_admin', 'operations_admin', 'super_admin'] as const;

export type AdminAuthRole = (typeof adminAuthRoles)[number];

export const isAdminAuthRoleForRoute = (
  role: string | null,
): role is AdminAuthRole => {
  return role !== null && adminAuthRoles.includes(role as AdminAuthRole);
};

export type AdminProtectedRouteDecision = 'allow' | 'redirect-login';

export const resolveAdminProtectedRoute = ({
  isAuthenticated,
  role,
}: {
  isAuthenticated: boolean;
  role: string | null;
}): AdminProtectedRouteDecision => {
  if (!isAuthenticated || !isAdminAuthRoleForRoute(role)) {
    return 'redirect-login';
  }

  return 'allow';
};
