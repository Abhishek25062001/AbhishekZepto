export const AUTH_ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
  PENDING_APPROVAL: 'pending_approval',
  DELETED: 'deleted',
} as const;

export const AUTH_ACCOUNT_STATUSES = Object.values(AUTH_ACCOUNT_STATUS);
