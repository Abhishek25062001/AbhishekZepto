import { Types } from 'mongoose';
import { writeAuditLog } from '../../../audit';
import { LEDGER_ACCOUNT_TYPE } from '../constants/ledger-account-type.constant';
import { LEDGER_JOURNAL_STATUS } from '../constants/ledger-journal-status.constant';
import { LEDGER_POSTING_TYPE } from '../constants/ledger-posting-type.constant';
import { LEDGER_SOURCE_TYPE } from '../constants/ledger-source-type.constant';
import { LEDGER_AUDIT_EVENTS } from '../constants/ledger-audit-events.constant';
import { findActiveLedgerAccountsByIds } from '../repositories/ledger-account.repository';
import {
  createJournalEntry,
  createTransactionLines,
  findJournalById,
  findJournalByIdempotencyKey,
  getNextJournalSequenceForDate,
  listJournals,
  listLinesByJournalId,
  updateJournalStatus,
} from '../repositories/ledger-journal.repository';
import type {
  CreateJournalEntryInput,
  LedgerAuditContext,
  LedgerJournalListQuery,
  LedgerJournalResponse,
  ReverseJournalInput,
} from '../types/ledger.types';
import { formatJournalCode } from '../utils/ledger-journal-code.util';
import { toLedgerJournalResponse } from '../utils/ledger-journal-response.mapper';
import {
  ledgerIdempotencyKeyAlreadyUsedError,
  ledgerJournalAlreadyPostedError,
  ledgerJournalAlreadyReversedError,
  ledgerJournalCannotReverseError,
  ledgerJournalNotBalancedError,
  ledgerJournalNotFoundError,
  ledgerLineInvalidError,
  ledgerAccountPostingNotAllowedError,
} from '../utils/ledger-error.mapper';
import { sanitizeLedgerAuditMetadata } from '../utils/ledger-audit-sanitizer.util';

const isDebitNormalAccount = (accountType: string): boolean =>
  accountType === LEDGER_ACCOUNT_TYPE.ASSET || accountType === LEDGER_ACCOUNT_TYPE.EXPENSE;

const validateLines = (
  lines: CreateJournalEntryInput['lines'],
): { totalDebit: number; totalCredit: number } => {
  if (!lines || lines.length < 2) {
    throw ledgerLineInvalidError({ reason: 'at_least_two_lines_required' });
  }

  let totalDebit = 0;
  let totalCredit = 0;

  for (const line of lines) {
    const debit = line.debitAmount ?? 0;
    const credit = line.creditAmount ?? 0;

    if (debit < 0 || credit < 0 || (debit > 0 && credit > 0) || (debit === 0 && credit === 0)) {
      throw ledgerLineInvalidError({ accountId: line.accountId });
    }

    totalDebit += debit;
    totalCredit += credit;
  }

  if (totalDebit !== totalCredit) {
    throw ledgerJournalNotBalancedError();
  }

  return { totalDebit, totalCredit };
};

const writeJournalAudit = async (
  eventType: string,
  journalId: Types.ObjectId,
  actorId: string,
  audit?: LedgerAuditContext,
  metadata: Record<string, unknown> = {},
): Promise<void> => {
  await writeAuditLog({
    eventType,
    actorId: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
    actorRole: null,
    actorSurface: 'backend',
    entityType: 'ledger_journal',
    entityId: journalId,
    vendorId: null,
    storeId: null,
    cityId: null,
    requestId: audit?.requestId ?? null,
    traceId: audit?.traceId ?? null,
    ipAddress: null,
    userAgent: null,
    metadata: sanitizeLedgerAuditMetadata(metadata),
    status: 'success',
  });
};

export const createDraftJournal = async (
  input: CreateJournalEntryInput,
  actorId: string,
  audit?: LedgerAuditContext,
): Promise<LedgerJournalResponse> => {
  const existing = await findJournalByIdempotencyKey(input.idempotencyKey);

  if (existing) {
    if (existing.status === LEDGER_JOURNAL_STATUS.POSTED) {
      const lines = await listLinesByJournalId(existing._id.toString());
      return toLedgerJournalResponse(existing, lines);
    }

    throw ledgerIdempotencyKeyAlreadyUsedError();
  }

  const { totalDebit, totalCredit } = validateLines(input.lines);
  const accounts = await findActiveLedgerAccountsByIds(input.lines.map((line) => line.accountId));

  if (accounts.length !== input.lines.length) {
    throw ledgerLineInvalidError({ reason: 'inactive_or_missing_account' });
  }

  const accountMap = new Map(accounts.map((account) => [account._id.toString(), account]));

  for (const line of input.lines) {
    const account = accountMap.get(line.accountId);

    if (!account?.isPostingAllowed) {
      throw ledgerAccountPostingNotAllowedError();
    }
  }

  const now = new Date();
  const sequence = await getNextJournalSequenceForDate(now);
  const journalCode = formatJournalCode(now, sequence);

  const journal = await createJournalEntry({
    journalCode,
    sourceType: input.sourceType,
    sourceId:
      input.sourceId && Types.ObjectId.isValid(input.sourceId)
        ? new Types.ObjectId(input.sourceId)
        : null,
    sourceCode: input.sourceCode ?? null,
    postingType: input.postingType,
    idempotencyKey: input.idempotencyKey,
    currency: input.currency?.toUpperCase() ?? 'INR',
    totalDebit,
    totalCredit,
    status: LEDGER_JOURNAL_STATUS.DRAFT,
    reversalOfJournalId: null,
    reversedByJournalId: null,
    postedBy: null,
    postedAt: null,
    reversedBy: null,
    reversedAt: null,
    description: input.description ?? null,
    metadata: input.metadata ?? null,
    createdBy: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
  });

  const linePayloads = input.lines.map((line) => {
    const account = accountMap.get(line.accountId)!;

    return {
      journalEntryId: journal._id,
      journalCode: journal.journalCode,
      accountId: account._id,
      accountCode: account.accountCode,
      accountType: account.accountType,
      debitAmount: line.debitAmount ?? 0,
      creditAmount: line.creditAmount ?? 0,
      currency: journal.currency,
      description: line.description ?? null,
      sourceType: input.sourceType,
      sourceId: journal.sourceId,
      postingType: input.postingType,
      lineMetadata: line.lineMetadata ?? null,
    };
  });

  const lines = await createTransactionLines(linePayloads);

  await writeJournalAudit(
    LEDGER_AUDIT_EVENTS.JOURNAL_DRAFTED,
    journal._id,
    actorId,
    audit,
    { journalId: journal._id.toString(), journalCode },
  );

  return toLedgerJournalResponse(journal, lines);
};

export const postJournal = async (
  journalId: string,
  actorId: string,
  audit?: LedgerAuditContext,
): Promise<LedgerJournalResponse> => {
  const journal = await findJournalById(journalId);

  if (!journal) {
    throw ledgerJournalNotFoundError();
  }

  if (journal.status === LEDGER_JOURNAL_STATUS.POSTED) {
    throw ledgerJournalAlreadyPostedError();
  }

  if (journal.status !== LEDGER_JOURNAL_STATUS.DRAFT) {
    throw ledgerJournalCannotReverseError();
  }

  const lines = await listLinesByJournalId(journalId);
  const totalDebit = lines.reduce((sum, line) => sum + line.debitAmount, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.creditAmount, 0);

  if (totalDebit !== totalCredit) {
    throw ledgerJournalNotBalancedError();
  }

  const posted = await updateJournalStatus(journalId, {
    status: LEDGER_JOURNAL_STATUS.POSTED,
    totalDebit,
    totalCredit,
    postedBy: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
    postedAt: new Date(),
  });

  if (!posted) {
    throw ledgerJournalNotFoundError();
  }

  await writeJournalAudit(
    LEDGER_AUDIT_EVENTS.JOURNAL_POSTED,
    posted._id,
    actorId,
    audit,
    { journalId: posted._id.toString(), journalCode: posted.journalCode },
  );

  return toLedgerJournalResponse(posted, lines);
};

export const createAndPostJournal = async (
  input: CreateJournalEntryInput,
  actorId: string,
  audit?: LedgerAuditContext,
): Promise<LedgerJournalResponse> => {
  const existing = await findJournalByIdempotencyKey(input.idempotencyKey);

  if (existing?.status === LEDGER_JOURNAL_STATUS.POSTED) {
    const lines = await listLinesByJournalId(existing._id.toString());
    return toLedgerJournalResponse(existing, lines);
  }

  const draft = await createDraftJournal(input, actorId, audit);
  return postJournal(draft.id, actorId, audit);
};

export const reverseJournal = async (
  input: ReverseJournalInput,
  audit?: LedgerAuditContext,
): Promise<LedgerJournalResponse> => {
  const journal = await findJournalById(input.journalId);

  if (!journal) {
    throw ledgerJournalNotFoundError();
  }

  if (journal.status === LEDGER_JOURNAL_STATUS.REVERSED) {
    throw ledgerJournalAlreadyReversedError();
  }

  if (journal.status !== LEDGER_JOURNAL_STATUS.POSTED || journal.reversedByJournalId) {
    throw ledgerJournalCannotReverseError();
  }

  const originalLines = await listLinesByJournalId(journal._id.toString());
  const reversalIdempotencyKey = `${journal.idempotencyKey}:reversal`;

  const reversalLines = originalLines.map((line) => ({
    accountId: line.accountId.toString(),
    debitAmount: line.creditAmount,
    creditAmount: line.debitAmount,
    description: `Reversal: ${line.description ?? journal.journalCode}`,
  }));

  const reversalJournal = await createAndPostJournal(
    {
      sourceType: LEDGER_SOURCE_TYPE.SYSTEM_REVERSAL,
      sourceId: journal._id.toString(),
      sourceCode: journal.journalCode,
      postingType: LEDGER_POSTING_TYPE.REVERSAL,
      idempotencyKey: reversalIdempotencyKey,
      currency: journal.currency,
      description: input.reason,
      metadata: { reversalOfJournalId: journal._id.toString() },
      lines: reversalLines,
    },
    input.actorId,
    audit,
  );

  const reversed = await updateJournalStatus(journal._id.toString(), {
    status: LEDGER_JOURNAL_STATUS.REVERSED,
    reversedByJournalId: new Types.ObjectId(reversalJournal.id),
    reversedBy: Types.ObjectId.isValid(input.actorId) ? new Types.ObjectId(input.actorId) : null,
    reversedAt: new Date(),
  });

  if (!reversed) {
    throw ledgerJournalNotFoundError();
  }

  await writeJournalAudit(
    LEDGER_AUDIT_EVENTS.JOURNAL_REVERSED,
    reversed._id,
    input.actorId,
    audit,
    {
      journalId: reversed._id.toString(),
      reversalJournalId: reversalJournal.id,
      reason: input.reason,
    },
  );

  const reversalLinesResponse = await listLinesByJournalId(reversalJournal.id);
  return toLedgerJournalResponse(
    (await findJournalById(reversalJournal.id))!,
    reversalLinesResponse,
  );
};

export const listJournalsService = async (
  query: LedgerJournalListQuery,
): Promise<{
  journals: LedgerJournalResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  const result = await listJournals(query);

  return {
    journals: result.journals.map((journal) => toLedgerJournalResponse(journal)),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};

export const getJournalByIdService = async (journalId: string): Promise<LedgerJournalResponse> => {
  const journal = await findJournalById(journalId);

  if (!journal) {
    throw ledgerJournalNotFoundError();
  }

  const lines = await listLinesByJournalId(journalId);
  return toLedgerJournalResponse(journal, lines);
};

export const calculateNormalBalance = (
  accountType: string,
  debitTotal: number,
  creditTotal: number,
): number => {
  if (isDebitNormalAccount(accountType)) {
    return debitTotal - creditTotal;
  }

  return creditTotal - debitTotal;
};
