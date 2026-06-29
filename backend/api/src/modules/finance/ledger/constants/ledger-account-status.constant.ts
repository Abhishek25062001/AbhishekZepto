export const LEDGER_ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export const LEDGER_ACCOUNT_STATUS_VALUES = Object.values(LEDGER_ACCOUNT_STATUS);

export type LedgerAccountStatus =
  (typeof LEDGER_ACCOUNT_STATUS)[keyof typeof LEDGER_ACCOUNT_STATUS];
