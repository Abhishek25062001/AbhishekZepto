import type { Types } from 'mongoose';
import type { LedgerAccountCategory } from '../constants/ledger-account-category.constant';
import type { LedgerAccountStatus } from '../constants/ledger-account-status.constant';
import type { LedgerAccountType } from '../constants/ledger-account-type.constant';
import type { LedgerJournalStatus } from '../constants/ledger-journal-status.constant';
import type { LedgerPostingType } from '../constants/ledger-posting-type.constant';
import type { LedgerSourceType } from '../constants/ledger-source-type.constant';

export type LedgerAccountRecord = {
  accountCode: string;
  accountName: string;
  accountType: LedgerAccountType;
  accountCategory: LedgerAccountCategory;
  currency: string;
  description: string | null;
  isSystemAccount: boolean;
  isPostingAllowed: boolean;
  parentAccountId: Types.ObjectId | null;
  status: LedgerAccountStatus;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LedgerJournalEntryRecord = {
  journalCode: string;
  sourceType: LedgerSourceType;
  sourceId: Types.ObjectId | null;
  sourceCode: string | null;
  postingType: LedgerPostingType;
  idempotencyKey: string;
  currency: string;
  totalDebit: number;
  totalCredit: number;
  status: LedgerJournalStatus;
  reversalOfJournalId: Types.ObjectId | null;
  reversedByJournalId: Types.ObjectId | null;
  postedBy: Types.ObjectId | null;
  postedAt: Date | null;
  reversedBy: Types.ObjectId | null;
  reversedAt: Date | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdBy: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LedgerTransactionLineRecord = {
  journalEntryId: Types.ObjectId;
  journalCode: string;
  accountId: Types.ObjectId;
  accountCode: string;
  accountType: LedgerAccountType;
  debitAmount: number;
  creditAmount: number;
  currency: string;
  description: string | null;
  sourceType: LedgerSourceType;
  sourceId: Types.ObjectId | null;
  postingType: LedgerPostingType;
  lineMetadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateLedgerAccountInput = {
  accountCode: string;
  accountName: string;
  accountType: LedgerAccountType;
  accountCategory: LedgerAccountCategory;
  currency?: string;
  description?: string | null;
  isPostingAllowed?: boolean;
  parentAccountId?: string | null;
};

export type UpdateLedgerAccountInput = {
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

export type CreateLedgerLineInput = {
  accountId: string;
  debitAmount?: number;
  creditAmount?: number;
  description?: string | null;
  lineMetadata?: Record<string, unknown> | null;
};

export type CreateJournalEntryInput = {
  sourceType: LedgerSourceType;
  sourceId?: string | null;
  sourceCode?: string | null;
  postingType: LedgerPostingType;
  idempotencyKey: string;
  currency?: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  lines: CreateLedgerLineInput[];
};

export type PostJournalInput = {
  journalId: string;
  actorId: string;
};

export type ReverseJournalInput = {
  journalId: string;
  reason: string;
  actorId: string;
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

export type LedgerLineListQuery = {
  page?: number;
  limit?: number;
  sourceType?: LedgerSourceType;
  sourceId?: string;
  postingType?: LedgerPostingType;
  dateFrom?: string;
  dateTo?: string;
};

export type LedgerPostingContext = {
  paymentId: string;
  amountPaise: number;
  currency: string;
  platformFeeAmount?: number;
  deliveryFeeAmount?: number;
  taxAmount?: number;
  discountAmount?: number;
  vendorId?: string | null;
};

export type LedgerPostingRuleLine = {
  accountCode: string;
  debitAmount: number;
  creditAmount: number;
  description?: string | null;
};

export type LedgerPostingResult = {
  success: boolean;
  journalId: string | null;
  journalCode: string | null;
  created: boolean;
  error?: string;
};

export type LedgerIdempotencyInput = {
  idempotencyKey: string;
};

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

export type LedgerAccountBalanceResponse = {
  accountId: string;
  accountCode: string;
  currency: string;
  debitTotal: number;
  creditTotal: number;
  balance: number;
};

export type LedgerAuditContext = {
  actorId: string;
  requestId?: string | null;
  traceId?: string | null;
};

export type AdminLedgerActor = {
  userId: string;
  permissions: string[];
};
