export type LedgerAccountType =
  | 'asset'
  | 'liability'
  | 'income'
  | 'expense'
  | 'equity'
  | 'contra_asset'
  | 'contra_income';

export type LedgerAccountStatus = 'active' | 'inactive' | 'archived';

export type LedgerAccountCategory =
  | 'cash_bank'
  | 'payment_gateway_receivable'
  | 'vendor_payable'
  | 'delivery_partner_payable'
  | 'platform_fee_revenue'
  | 'delivery_fee_revenue'
  | 'commission_revenue'
  | 'tax_payable'
  | 'refund_payable'
  | 'discount_expense'
  | 'manual_adjustment'
  | 'other';

export type LedgerJournalStatus = 'draft' | 'posted' | 'reversed' | 'voided';

export type LedgerSourceType =
  | 'payment'
  | 'refund'
  | 'order'
  | 'vendor_settlement'
  | 'delivery_earning'
  | 'manual_adjustment'
  | 'system_reversal';

export type LedgerPostingType =
  | 'payment_received'
  | 'refund_approved'
  | 'refund_processed'
  | 'vendor_settlement_approved'
  | 'delivery_earning_accrued'
  | 'reversal'
  | 'manual_adjustment';

export type LedgerAccountResponse = {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: LedgerAccountType;
  accountCategory: LedgerAccountCategory;
  currency: string;
  description: string | null;
  isSystemAccount: boolean;
  isPostingAllowed: boolean;
  parentAccountId: string | null;
  status: LedgerAccountStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateLedgerAccountRequest = {
  accountCode: string;
  accountName: string;
  accountType: LedgerAccountType;
  accountCategory: LedgerAccountCategory;
  currency?: string;
  description?: string | null;
  isPostingAllowed?: boolean;
  parentAccountId?: string | null;
};

export type UpdateLedgerAccountRequest = {
  accountName?: string;
  description?: string | null;
  status?: LedgerAccountStatus;
  isPostingAllowed?: boolean;
  parentAccountId?: string | null;
};

export type LedgerAccountListQuery = {
  page?: number;
  limit?: number;
  accountType?: LedgerAccountType;
  accountCategory?: LedgerAccountCategory;
  currency?: string;
  status?: LedgerAccountStatus;
  isSystemAccount?: boolean;
  isPostingAllowed?: boolean;
  parentAccountId?: string;
  search?: string;
};

export type LedgerAccountListResponse = {
  items: LedgerAccountResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type LedgerTransactionLineResponse = {
  id: string;
  journalEntryId: string;
  journalCode: string;
  accountId: string;
  accountCode: string;
  accountType: LedgerAccountType;
  debitAmount: number;
  creditAmount: number;
  currency: string;
  description: string | null;
  sourceType: LedgerSourceType;
  sourceId: string | null;
  postingType: LedgerPostingType;
  createdAt: string;
};

export type LedgerJournalResponse = {
  id: string;
  journalCode: string;
  sourceType: LedgerSourceType;
  sourceId: string | null;
  sourceCode: string | null;
  postingType: LedgerPostingType;
  idempotencyKey: string;
  currency: string;
  totalDebit: number;
  totalCredit: number;
  status: LedgerJournalStatus;
  reversalOfJournalId: string | null;
  reversedByJournalId: string | null;
  postedAt: string | null;
  reversedAt: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  lines?: LedgerTransactionLineResponse[];
  createdAt: string;
  updatedAt: string;
};

export type LedgerJournalListQuery = {
  page?: number;
  limit?: number;
  sourceType?: LedgerSourceType;
  sourceId?: string;
  postingType?: LedgerPostingType;
  status?: LedgerJournalStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

export type LedgerJournalListResponse = {
  items: LedgerJournalResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ReverseLedgerJournalRequest = {
  reason: string;
};

export type LedgerAccountLinesQuery = {
  page?: number;
  limit?: number;
  sourceType?: LedgerSourceType;
  sourceId?: string;
  postingType?: LedgerPostingType;
  dateFrom?: string;
  dateTo?: string;
};

export type LedgerAccountLinesResponse = {
  items: LedgerTransactionLineResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type LedgerAccountBalanceResponse = {
  accountId: string;
  accountCode: string;
  currency: string;
  debitTotal: number;
  creditTotal: number;
  balance: number;
};
