import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';

export const ADMIN_USER_MANAGED_ROLES = [
  AUTH_ROLE.SUPPORT_ADMIN,
  AUTH_ROLE.OPERATIONS_ADMIN,
  AUTH_ROLE.SUPER_ADMIN,
] as const;

export const ADMIN_USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
  PENDING_APPROVAL: 'pending_approval',
} as const;

export const ADMIN_USER_STATUSES = Object.values(ADMIN_USER_STATUS);
