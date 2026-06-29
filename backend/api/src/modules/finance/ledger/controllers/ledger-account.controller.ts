import { sendCreatedResponse, sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import {
  archiveLedgerAccountService,
  createLedgerAccountService,
  getLedgerAccountByIdService,
  listLedgerAccountsService,
  updateLedgerAccountService,
} from '../services/ledger-account.service';
import { listLinesByAccountIdService } from '../services/ledger-line.service';
import type {
  CreateLedgerAccountInput,
  LedgerAccountListQuery,
  LedgerAuditContext,
  LedgerLineListQuery,
  UpdateLedgerAccountInput,
} from '../types/ledger.types';

const actorIdFromRequest = (req: { user?: { userId?: string } }): string => req.user?.userId ?? '';

const auditFromRequest = (req: {
  user?: { userId?: string };
  requestId?: string;
  traceId?: string;
}): LedgerAuditContext => ({
  actorId: actorIdFromRequest(req),
  requestId: req.requestId ?? null,
  traceId: req.traceId ?? null,
});

export const createLedgerAccountController = asyncHandler(async (req, res) => {
  const data = await createLedgerAccountService(
    req.body as CreateLedgerAccountInput,
    actorIdFromRequest(req),
    auditFromRequest(req),
  );

  return sendCreatedResponse({
    res,
    message: 'Ledger account created successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listLedgerAccountsController = asyncHandler(async (req, res) => {
  const result = await listLedgerAccountsService(req.query as LedgerAccountListQuery);

  return sendSuccessResponse({
    res,
    message: 'Ledger accounts fetched successfully',
    data: {
      items: result.accounts,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit) || 0,
      hasNextPage: result.page * result.limit < result.total,
      hasPreviousPage: result.page > 1,
    },
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const getLedgerAccountByIdController = asyncHandler(async (req, res) => {
  const data = await getLedgerAccountByIdService(String(req.params.accountId));

  return sendSuccessResponse({
    res,
    message: 'Ledger account fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const updateLedgerAccountController = asyncHandler(async (req, res) => {
  const data = await updateLedgerAccountService(
    String(req.params.accountId),
    req.body as UpdateLedgerAccountInput,
    actorIdFromRequest(req),
    auditFromRequest(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Ledger account updated successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const archiveLedgerAccountController = asyncHandler(async (req, res) => {
  const data = await archiveLedgerAccountService(
    String(req.params.accountId),
    actorIdFromRequest(req),
    auditFromRequest(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Ledger account archived successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const listAccountLinesController = asyncHandler(async (req, res) => {
  const result = await listLinesByAccountIdService(
    String(req.params.accountId),
    req.query as LedgerLineListQuery,
  );

  return sendSuccessResponse({
    res,
    message: 'Ledger account lines fetched successfully',
    data: {
      items: result.lines,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit) || 0,
      hasNextPage: result.page * result.limit < result.total,
      hasPreviousPage: result.page > 1,
    },
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
