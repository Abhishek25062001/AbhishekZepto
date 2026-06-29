import type { Types } from 'mongoose';
import type { LedgerAccountRecord } from '../types/ledger.types';
import type { LedgerAccountResponse } from '../types/ledger.types';

type LedgerAccountLike = LedgerAccountRecord & { _id: Types.ObjectId };

export const toLedgerAccountResponse = (account: LedgerAccountLike): LedgerAccountResponse => ({
  id: account._id.toString(),
  accountCode: account.accountCode,
  accountName: account.accountName,
  accountType: account.accountType,
  accountCategory: account.accountCategory,
  currency: account.currency,
  description: account.description,
  isSystemAccount: account.isSystemAccount,
  isPostingAllowed: account.isPostingAllowed,
  parentAccountId: account.parentAccountId?.toString() ?? null,
  status: account.status,
  createdAt: account.createdAt.toISOString(),
  updatedAt: account.updatedAt.toISOString(),
});
