import { Types, type FilterQuery } from 'mongoose';
import { LEDGER_ACCOUNT_STATUS } from '../constants/ledger-account-status.constant';
import { LedgerAccountModel } from '../models/ledger-account.model';
import { LedgerTransactionLineModel } from '../models/ledger-transaction-line.model';
import type {
  LedgerAccountListQuery,
  LedgerAccountRecord,
} from '../types/ledger.types';

export const createLedgerAccount = async (
  payload: Partial<LedgerAccountRecord>,
): Promise<LedgerAccountRecord & { _id: Types.ObjectId }> => {
  const created = await LedgerAccountModel.create(payload);
  return created.toObject() as LedgerAccountRecord & { _id: Types.ObjectId };
};

export const findLedgerAccountById = async (
  accountId: string,
): Promise<(LedgerAccountRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(accountId)) {
    return null;
  }

  return LedgerAccountModel.findOne({
    _id: new Types.ObjectId(accountId),
    isDeleted: false,
  }).lean();
};

export const findLedgerAccountByCode = async (
  accountCode: string,
): Promise<(LedgerAccountRecord & { _id: Types.ObjectId }) | null> => {
  if (!accountCode) {
    return null;
  }

  return LedgerAccountModel.findOne({
    accountCode: accountCode.toUpperCase(),
    isDeleted: false,
  }).lean();
};

export const updateLedgerAccountById = async (
  accountId: string,
  payload: Partial<LedgerAccountRecord>,
): Promise<(LedgerAccountRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(accountId)) {
    return null;
  }

  return LedgerAccountModel.findOneAndUpdate(
    { _id: new Types.ObjectId(accountId), isDeleted: false },
    { $set: payload },
    { new: true },
  ).lean();
};

export const archiveLedgerAccountById = async (
  accountId: string,
  actorId: string,
): Promise<(LedgerAccountRecord & { _id: Types.ObjectId }) | null> => {
  if (!Types.ObjectId.isValid(accountId)) {
    return null;
  }

  return LedgerAccountModel.findOneAndUpdate(
    { _id: new Types.ObjectId(accountId), isDeleted: false },
    {
      $set: {
        status: LEDGER_ACCOUNT_STATUS.ARCHIVED,
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
      },
    },
    { new: true },
  ).lean();
};

const buildAccountListFilter = (query: LedgerAccountListQuery): FilterQuery<LedgerAccountRecord> => {
  const filter: FilterQuery<LedgerAccountRecord> = { isDeleted: false };

  if (query.accountType) {
    filter.accountType = query.accountType;
  }

  if (query.accountCategory) {
    filter.accountCategory = query.accountCategory;
  }

  if (query.currency) {
    filter.currency = query.currency;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (typeof query.isSystemAccount === 'boolean') {
    filter.isSystemAccount = query.isSystemAccount;
  }

  if (typeof query.isPostingAllowed === 'boolean') {
    filter.isPostingAllowed = query.isPostingAllowed;
  }

  if (query.parentAccountId && Types.ObjectId.isValid(query.parentAccountId)) {
    filter.parentAccountId = new Types.ObjectId(query.parentAccountId);
  }

  if (query.search?.trim()) {
    const search = query.search.trim();
    filter.$or = [
      { accountCode: { $regex: search, $options: 'i' } },
      { accountName: { $regex: search, $options: 'i' } },
    ];
  }

  return filter;
};

export const listLedgerAccounts = async (
  query: LedgerAccountListQuery,
): Promise<{
  accounts: Array<LedgerAccountRecord & { _id: Types.ObjectId }>;
  total: number;
  page: number;
  limit: number;
}> => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter = buildAccountListFilter(query);
  const skip = (page - 1) * limit;

  const [accounts, total] = await Promise.all([
    LedgerAccountModel.find(filter).sort({ accountCode: 1 }).skip(skip).limit(limit).lean(),
    LedgerAccountModel.countDocuments(filter),
  ]);

  return {
    accounts: accounts as Array<LedgerAccountRecord & { _id: Types.ObjectId }>,
    total,
    page,
    limit,
  };
};

export const countPostedLinesByAccountId = async (accountId: string): Promise<number> => {
  if (!Types.ObjectId.isValid(accountId)) {
    return 0;
  }

  return LedgerTransactionLineModel.countDocuments({
    accountId: new Types.ObjectId(accountId),
  });
};

export const findActiveLedgerAccountsByIds = async (
  accountIds: string[],
): Promise<Array<LedgerAccountRecord & { _id: Types.ObjectId }>> => {
  const objectIds = accountIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (objectIds.length === 0) {
    return [];
  }

  return LedgerAccountModel.find({
    _id: { $in: objectIds },
    isDeleted: false,
    status: LEDGER_ACCOUNT_STATUS.ACTIVE,
  }).lean() as Promise<Array<LedgerAccountRecord & { _id: Types.ObjectId }>>;
};
