export const CUSTOMER_RISK_STATUS = {
  NORMAL: 'normal',
  WATCHLIST: 'watchlist',
  HIGH_RISK: 'high_risk',
} as const;

export const CUSTOMER_RISK_STATUSES = Object.values(CUSTOMER_RISK_STATUS);

export const CUSTOMER_MANAGEMENT_ENTITY_TYPE = 'customer';

export const CUSTOMER_MANAGEMENT_ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
  SUSPENDED: 'suspended',
  PENDING_APPROVAL: 'pending_approval',
} as const;

export const CUSTOMER_MANAGEMENT_ACCOUNT_STATUSES = Object.values(CUSTOMER_MANAGEMENT_ACCOUNT_STATUS);
