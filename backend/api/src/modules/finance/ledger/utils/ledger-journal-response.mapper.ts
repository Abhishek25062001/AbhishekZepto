import type { Types } from 'mongoose';
import { sanitizeLedgerAuditMetadata } from './ledger-audit-sanitizer.util';
import type {
  LedgerJournalEntryRecord,
  LedgerJournalResponse,
  LedgerTransactionLineRecord,
  LedgerTransactionLineResponse,
} from '../types/ledger.types';

type LedgerJournalLike = LedgerJournalEntryRecord & { _id: Types.ObjectId };
type LedgerLineLike = LedgerTransactionLineRecord & { _id: Types.ObjectId };

export const toLedgerTransactionLineResponse = (
  line: LedgerLineLike,
): LedgerTransactionLineResponse => ({
  id: line._id.toString(),
  journalEntryId: line.journalEntryId.toString(),
  journalCode: line.journalCode,
  accountId: line.accountId.toString(),
  accountCode: line.accountCode,
  accountType: line.accountType,
  debitAmount: line.debitAmount,
  creditAmount: line.creditAmount,
  currency: line.currency,
  description: line.description,
  sourceType: line.sourceType,
  sourceId: line.sourceId?.toString() ?? null,
  postingType: line.postingType,
  createdAt: line.createdAt.toISOString(),
});

export const toLedgerJournalResponse = (
  journal: LedgerJournalLike,
  lines?: LedgerLineLike[],
): LedgerJournalResponse => ({
  id: journal._id.toString(),
  journalCode: journal.journalCode,
  sourceType: journal.sourceType,
  sourceId: journal.sourceId?.toString() ?? null,
  sourceCode: journal.sourceCode,
  postingType: journal.postingType,
  idempotencyKey: journal.idempotencyKey,
  currency: journal.currency,
  totalDebit: journal.totalDebit,
  totalCredit: journal.totalCredit,
  status: journal.status,
  reversalOfJournalId: journal.reversalOfJournalId?.toString() ?? null,
  reversedByJournalId: journal.reversedByJournalId?.toString() ?? null,
  postedAt: journal.postedAt?.toISOString() ?? null,
  reversedAt: journal.reversedAt?.toISOString() ?? null,
  description: journal.description,
  metadata: sanitizeLedgerAuditMetadata(journal.metadata),
  lines: lines?.map(toLedgerTransactionLineResponse),
  createdAt: journal.createdAt.toISOString(),
  updatedAt: journal.updatedAt.toISOString(),
});
