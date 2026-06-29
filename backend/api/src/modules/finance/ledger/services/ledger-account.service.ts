import { Types } from 'mongoose';
import { writeAuditLog } from '../../../audit';
import { LEDGER_ACCOUNT_STATUS } from '../constants/ledger-account-status.constant';
import { LEDGER_AUDIT_EVENTS } from '../constants/ledger-audit-events.constant';
import {
  archiveLedgerAccountById,
  countPostedLinesByAccountId,
  createLedgerAccount,
  findLedgerAccountByCode,
  findLedgerAccountById,
  listLedgerAccounts,
  updateLedgerAccountById,
} from '../repositories/ledger-account.repository';
import type {
  CreateLedgerAccountInput,
  LedgerAccountListQuery,
  LedgerAccountResponse,
  LedgerAuditContext,
  UpdateLedgerAccountInput,
} from '../types/ledger.types';
import { normalizeLedgerAccountCode } from '../utils/ledger-account-code.util';
import { toLedgerAccountResponse } from '../utils/ledger-account-response.mapper';
import {
  ledgerAccountCodeAlreadyExistsError,
  ledgerAccountHasPostedLinesError,
  ledgerAccountNotFoundError,
  ledgerParentAccountInvalidError,
  ledgerSystemAccountImmutableError,
} from '../utils/ledger-error.mapper';
import { sanitizeLedgerAuditMetadata } from '../utils/ledger-audit-sanitizer.util';

const validateParentAccount = async (parentAccountId: string | null | undefined): Promise<void> => {
  if (!parentAccountId) {
    return;
  }

  const parent = await findLedgerAccountById(parentAccountId);

  if (!parent || parent.status !== LEDGER_ACCOUNT_STATUS.ACTIVE) {
    throw ledgerParentAccountInvalidError();
  }
};

const writeLedgerAccountAudit = async (
  eventType: string,
  accountId: Types.ObjectId,
  actorId: string,
  audit?: LedgerAuditContext,
  metadata: Record<string, unknown> = {},
): Promise<void> => {
  await writeAuditLog({
    eventType,
    actorId: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
    actorRole: null,
    actorSurface: 'admin_dashboard',
    entityType: 'ledger_account',
    entityId: accountId,
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

export const createLedgerAccountService = async (
  input: CreateLedgerAccountInput,
  actorId: string,
  audit?: LedgerAuditContext,
): Promise<LedgerAccountResponse> => {
  const accountCode = normalizeLedgerAccountCode(input.accountCode);
  const existing = await findLedgerAccountByCode(accountCode);

  if (existing) {
    throw ledgerAccountCodeAlreadyExistsError();
  }

  await validateParentAccount(input.parentAccountId ?? null);

  const account = await createLedgerAccount({
    accountCode,
    accountName: input.accountName.trim(),
    accountType: input.accountType,
    accountCategory: input.accountCategory,
    currency: input.currency?.toUpperCase() ?? 'INR',
    description: input.description ?? null,
    isSystemAccount: false,
    isPostingAllowed: input.isPostingAllowed ?? true,
    parentAccountId:
      input.parentAccountId && Types.ObjectId.isValid(input.parentAccountId)
        ? new Types.ObjectId(input.parentAccountId)
        : null,
    status: LEDGER_ACCOUNT_STATUS.ACTIVE,
    createdBy: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
    updatedBy: null,
    isDeleted: false,
    deletedAt: null,
  });

  await writeLedgerAccountAudit(
    LEDGER_AUDIT_EVENTS.ACCOUNT_CREATED,
    account._id,
    actorId,
    audit,
    { accountId: account._id.toString(), accountCode },
  );

  return toLedgerAccountResponse(account);
};

export const listLedgerAccountsService = async (
  query: LedgerAccountListQuery,
): Promise<{
  accounts: LedgerAccountResponse[];
  total: number;
  page: number;
  limit: number;
}> => {
  const result = await listLedgerAccounts(query);

  return {
    accounts: result.accounts.map(toLedgerAccountResponse),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
};

export const getLedgerAccountByIdService = async (
  accountId: string,
): Promise<LedgerAccountResponse> => {
  const account = await findLedgerAccountById(accountId);

  if (!account) {
    throw ledgerAccountNotFoundError();
  }

  return toLedgerAccountResponse(account);
};

export const updateLedgerAccountService = async (
  accountId: string,
  input: UpdateLedgerAccountInput,
  actorId: string,
  audit?: LedgerAuditContext,
): Promise<LedgerAccountResponse> => {
  const account = await findLedgerAccountById(accountId);

  if (!account) {
    throw ledgerAccountNotFoundError();
  }

  if (account.isSystemAccount) {
    throw ledgerSystemAccountImmutableError();
  }

  if (input.parentAccountId) {
    await validateParentAccount(input.parentAccountId);
  }

  const updated = await updateLedgerAccountById(accountId, {
    ...(input.accountName !== undefined ? { accountName: input.accountName.trim() } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.isPostingAllowed !== undefined ? { isPostingAllowed: input.isPostingAllowed } : {}),
    ...(input.parentAccountId !== undefined
      ? {
          parentAccountId:
            input.parentAccountId && Types.ObjectId.isValid(input.parentAccountId)
              ? new Types.ObjectId(input.parentAccountId)
              : null,
        }
      : {}),
    updatedBy: Types.ObjectId.isValid(actorId) ? new Types.ObjectId(actorId) : null,
  });

  if (!updated) {
    throw ledgerAccountNotFoundError();
  }

  await writeLedgerAccountAudit(
    LEDGER_AUDIT_EVENTS.ACCOUNT_UPDATED,
    updated._id,
    actorId,
    audit,
    { accountId: updated._id.toString() },
  );

  return toLedgerAccountResponse(updated);
};

export const archiveLedgerAccountService = async (
  accountId: string,
  actorId: string,
  audit?: LedgerAuditContext,
): Promise<LedgerAccountResponse> => {
  const account = await findLedgerAccountById(accountId);

  if (!account) {
    throw ledgerAccountNotFoundError();
  }

  if (account.isSystemAccount) {
    throw ledgerSystemAccountImmutableError();
  }

  const postedLineCount = await countPostedLinesByAccountId(accountId);

  if (postedLineCount > 0) {
    throw ledgerAccountHasPostedLinesError();
  }

  const archived = await archiveLedgerAccountById(accountId, actorId);

  if (!archived) {
    throw ledgerAccountNotFoundError();
  }

  await writeLedgerAccountAudit(
    LEDGER_AUDIT_EVENTS.ACCOUNT_ARCHIVED,
    archived._id,
    actorId,
    audit,
    { accountId: archived._id.toString() },
  );

  return toLedgerAccountResponse(archived);
};
