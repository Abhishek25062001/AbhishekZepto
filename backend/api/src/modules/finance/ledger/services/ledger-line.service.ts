import {
  aggregateAccountLineTotals,
  listLinesByAccountId,
} from '../repositories/ledger-journal.repository';
import { findLedgerAccountById } from '../repositories/ledger-account.repository';
import type {
  LedgerAccountBalanceResponse,
  LedgerLineListQuery,
  LedgerTransactionLineResponse,
} from '../types/ledger.types';
import { ledgerAccountNotFoundError } from '../utils/ledger-error.mapper';
import { toLedgerTransactionLineResponse } from '../utils/ledger-journal-response.mapper';
import { calculateNormalBalance } from './ledger-journal.service';

export const listLinesByAccountIdService = async (
  accountId: string,
  query: LedgerLineListQuery,
): Promise<{
  lines: LedgerTransactionLineResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  const account = await findLedgerAccountById(accountId);

  if (!account) {
    throw ledgerAccountNotFoundError();
  }

  const result = await listLinesByAccountId(accountId, query);

  return {
    lines: result.lines.map(toLedgerTransactionLineResponse),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};

export const calculateAccountBalance = async (
  accountId: string,
): Promise<LedgerAccountBalanceResponse> => {
  const account = await findLedgerAccountById(accountId);

  if (!account) {
    throw ledgerAccountNotFoundError();
  }

  const totals = await aggregateAccountLineTotals(accountId);

  return {
    accountId: account._id.toString(),
    accountCode: account.accountCode,
    currency: account.currency,
    debitTotal: totals.debitTotal,
    creditTotal: totals.creditTotal,
    balance: calculateNormalBalance(
      account.accountType,
      totals.debitTotal,
      totals.creditTotal,
    ),
  };
};
