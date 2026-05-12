export const AUTH_ROLE = {
  CUSTOMER: 'customer',
  DELIVERY_AGENT: 'delivery_agent',
  VENDOR_OWNER: 'vendor_owner',
  STORE_MANAGER: 'store_manager',
  STORE_STAFF: 'store_staff',
  SUPPORT_ADMIN: 'support_admin',
  OPERATIONS_ADMIN: 'operations_admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const AUTH_ROLES = Object.values(AUTH_ROLE);
