const vendorAuthRoles = ['vendor_owner', 'store_manager', 'store_staff'] as const;

export type VendorAuthRole = (typeof vendorAuthRoles)[number];

export const isVendorAuthRoleForRoute = (
  role: string | null,
): role is VendorAuthRole => {
  return role !== null && vendorAuthRoles.includes(role as VendorAuthRole);
};

export const hasVendorRouteScope = ({
  vendorId,
  storeId,
}: {
  vendorId: string | null;
  storeId: string | null;
}): boolean => {
  return Boolean(vendorId?.trim() && storeId?.trim());
};

export type VendorProtectedRouteDecision = 'allow' | 'redirect-login';

export const resolveVendorProtectedRoute = ({
  isAuthenticated,
  role,
  vendorId,
  storeId,
}: {
  isAuthenticated: boolean;
  role: string | null;
  vendorId: string | null;
  storeId: string | null;
}): VendorProtectedRouteDecision => {
  if (!isAuthenticated) {
    return 'redirect-login';
  }

  if (!isVendorAuthRoleForRoute(role) || !hasVendorRouteScope({ vendorId, storeId })) {
    return 'redirect-login';
  }

  return 'allow';
};
