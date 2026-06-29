import { Types, type FilterQuery } from 'mongoose';
import { LEDGER_JOURNAL_STATUS } from '../constants/ledger-journal-status.constant';
import { LedgerJournalEntryModel } from '../models/ledger-journal-entry.model';
import { LedgerTransactionLineModel } from '../models/ledger-transaction-line.model';
import { buildJournalCodePrefixForDate } from '../utils/ledger-journal-code.util';
import type {
  LedgerJournalEntryRecord,
  LedgerJournalListQuery,
  LedgerLineListQuery,
  LedgerTransactionLineRecord,
} from '../types/ledger.types';

export const createJournalEntry = async (
  payload: Partial<LedgerJournalEntryRecord>,
): Promise<LedgerJournalEntryRecord & { _id: Types.ObjectId }> => {
  const created = await LedgerJournalEntryModel.create(payload);
  return created.toObject() as LedgerJournalEntryRecord & { _id: Types.ObjectId };
};

export const createTransactionLines = async (
  lines: Array<Partial<LedgerTransactionLineRecord>>,
): Promise<Array<LedgerTransactionLineRecord & { _id: Types.ObjectId }>> => {
  const created = await LedgerTransactionLineModel.insertMany(lines);
  return created.map((line) => line.toObject()) as Array<
    LedgerTransactionLineRecord & { _id: Types.ObjectId }
  >;
};

export const findJournalById = async (
  journalId: string,
): Promise<(LedgerJournalEntryRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(journalId)) {
    return null;
  }

  return LedgerJournalEntryModel.findById(journalId).lean();
};

export const findJournalByCode = async (
  journalCode: string,
): Promise<(LedgerJournalEntryRecord & { _id: Types.ObjectId }) | null> => {
  if (!journalCode) {
    return null;
  }

  return LedgerJournalEntryModel.findOne({ journalCode }).lean();
};

export const findJournalByIdempotencyKey = async (
  idempotencyKey: string,
): Promise<(LedgerJournalEntryRecord & { _id: Types.ObjectId }) | null> => {
  if (!idempotencyKey) {
    return null;
  }

  return LedgerJournalEntryModel.findOne({ idempotencyKey }).lean();
};

export const findJournalBySource = async (
  sourceType: string,
  sourceId: string,
  postingType: string,
): Promise<(LedgerJournalEntryRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(sourceId)) {
    return null;
  }

  return LedgerJournalEntryModel.findOne({
    sourceType,
    sourceId: new Types.ObjectId(sourceId),
    postingType,
    status: LEDGER_JOURNAL_STATUS.POSTED,
  }).lean();
};

export const updateJournalStatus = async (
  journalId: string,
  payload: Partial<LedgerJournalEntryRecord>,
): Promise<(LedgerJournalEntryRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(journalId)) {
    return null;
  }

  return LedgerJournalEntryModel.findByIdAndUpdate(
    journalId,
    { $set: payload },
    { new: true },
  ).lean();
};

const buildJournalListFilter = (
  query: LedgerJournalListQuery,
): FilterQuery<LedgerJournalEntryRecord> => {
  const filter: FilterQuery<LedgerJournalEntryRecord> = {};

  if (query.sourceType) {
    filter.sourceType = query.sourceType;
  }

  if (query.sourceId && Types.ObjectId.isValid(query.sourceId)) {
    filter.sourceId = new Types.ObjectId(query.sourceId);
  }

  if (query.postingType) {
    filter.postingType = query.postingType;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) {
      filter.createdAt.$gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      filter.createdAt.$lte = new Date(query.dateTo);
    }
  }

  if (query.search?.trim()) {
    const search = query.search.trim();
    filter.$or = [
      { journalCode: search },
      { idempotencyKey: search },
      { sourceCode: search },
    ];
    if (Types.ObjectId.isValid(search)) {
      filter.$or.push({ _id: new Types.ObjectId(search) });
    }
  }

  return filter;
};

export const listJournals = async (
  query: LedgerJournalListQuery,
): Promise<{
  journals: Array<LedgerJournalEntryRecord & { _id: Types.ObjectId }>;
  total: number;
  page: number;
  limit: number;
}> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter = buildJournalListFilter(query);
  const skip = (page - 1) * limit;

  const [journals, total] = await Promise.all([
    LedgerJournalEntryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    LedgerJournalEntryModel.countDocuments(filter),
  ]);

  return {
    journals: journals as Array<LedgerJournalEntryRecord & { _id: Types.ObjectId }>,
    total,
    page,
    limit,
  };
};

export const listLinesByJournalId = async (
  journalId: string,
): Promise<Array<LedgerTransactionLineRecord & { _id: Types.ObjectId }>> => {
  if (!Types.ObjectId.isValid(journalId)) {
    return [];
  }

  return LedgerTransactionLineModel.find({
    journalEntryId: new Types.ObjectId(journalId),
  })
    .sort({ createdAt: 1 })
    .lean() as Promise<Array<LedgerTransactionLineRecord & { _id: Types.ObjectId }>>;
};

const buildLineListFilter = (
  accountId: string,
  query: LedgerLineListQuery,
): FilterQuery<LedgerTransactionLineRecord> => {
  const filter: FilterQuery<LedgerTransactionLineRecord> = {
    accountId: new Types.ObjectId(accountId),
  };

  if (query.sourceType) {
    filter.sourceType = query.sourceType;
  }

  if (query.sourceId && Types.ObjectId.isValid(query.sourceId)) {
    filter.sourceId = new Types.ObjectId(query.sourceId);
  }

  if (query.postingType) {
    filter.postingType = query.postingType;
  }

  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) {
      filter.createdAt.$gte = new Date(query.dateFrom);
    }
    if (query.dateTo) {
      filter.createdAt.$lte = new Date(query.dateTo);
    }
  }

  return filter;
};

export const listLinesByAccountId = async (
  accountId: string,
  query: LedgerLineListQuery,
): Promise<{
  lines: Array<LedgerTransactionLineRecord & { _id: Types.ObjectId }>;
  total: number;
  page: number;
  limit: number;
}> => {
  if (!Types.ObjectId.isValid(accountId)) {
    return { lines: [], total: 0, page: query.page ?? 1, limit: query.limit ?? 20 };
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter = buildLineListFilter(accountId, query);
  const skip = (page - 1) * limit;

  const [lines, total] = await Promise.all([
    LedgerTransactionLineModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    LedgerTransactionLineModel.countDocuments(filter),
  ]);

  return {
    lines: lines as Array<LedgerTransactionLineRecord & { _id: Types.ObjectId }>,
    total,
    page,
    limit,
  };
};

export const getNextJournalSequenceForDate = async (date: Date): Promise<number> => {
  const prefix = buildJournalCodePrefixForDate(date);
  const latest = await LedgerJournalEntryModel.findOne({
    journalCode: { $regex: `^${prefix}` },
  })
    .sort({ journalCode: -1 })
    .select('journalCode')
    .lean();

  if (!latest?.journalCode) {
    return 1;
  }

  const suffix = latest.journalCode.slice(prefix.length);
  const parsed = Number.parseInt(suffix, 10);

  return Number.isFinite(parsed) ? parsed + 1 : 1;
};

export const aggregateAccountLineTotals = async (
  accountId: string,
): Promise<{ debitTotal: number; creditTotal: number }> => {
  if (!Types.ObjectId.isValid(accountId)) {
    return { debitTotal: 0, creditTotal: 0 };
  }

  const result = await LedgerTransactionLineModel.aggregate<{ debitTotal: number; creditTotal: number }>([
    { $match: { accountId: new Types.ObjectId(accountId) } },
    {
      $group: {
        _id: null,
        debitTotal: { $sum: '$debitAmount' },
        creditTotal: { $sum: '$creditAmount' },
      },
    },
  ]);

  if (!result[0]) {
    return { debitTotal: 0, creditTotal: 0 };
  }

  return {
    debitTotal: result[0].debitTotal ?? 0,
    creditTotal: result[0].creditTotal ?? 0,
  };
};
