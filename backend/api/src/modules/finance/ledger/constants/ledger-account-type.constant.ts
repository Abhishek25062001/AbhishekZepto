export const LEDGER_ACCOUNT_TYPE = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  INCOME: 'income',
  EXPENSE: 'expense',
  EQUITY: 'equity',
  CONTRA_ASSET: 'contra_asset',
  CONTRA_INCOME: 'contra_income',
} as const;

export const LEDGER_ACCOUNT_TYPE_VALUES = Object.values(LEDGER_ACCOUNT_TYPE);

export type LedgerAccountType =
  (typeof LEDGER_ACCOUNT_TYPE)[keyof typeof LEDGER_ACCOUNT_TYPE];
