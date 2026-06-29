import { sendSuccessResponse } from '../../../../utils/api-response';
import { asyncHandler } from '../../../../utils/async-handler';
import {
  getJournalByIdService,
  listJournalsService,
  reverseJournal,
} from '../services/ledger-journal.service';
import type { LedgerAuditContext, LedgerJournalListQuery } from '../types/ledger.types';

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

export const listLedgerJournalsController = asyncHandler(async (req, res) => {
  const result = await listJournalsService(req.query as LedgerJournalListQuery);

  return sendSuccessResponse({
    res,
    message: 'Ledger journals fetched successfully',
    data: {
      items: result.journals,
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

export const getLedgerJournalByIdController = asyncHandler(async (req, res) => {
  const data = await getJournalByIdService(String(req.params.journalId));

  return sendSuccessResponse({
    res,
    message: 'Ledger journal fetched successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});

export const reverseLedgerJournalController = asyncHandler(async (req, res) => {
  const data = await reverseJournal(
    {
      journalId: String(req.params.journalId),
      reason: (req.body as { reason: string }).reason,
      actorId: actorIdFromRequest(req),
    },
    auditFromRequest(req),
  );

  return sendSuccessResponse({
    res,
    message: 'Ledger journal reversed successfully',
    data,
    meta: { requestId: req.requestId, traceId: req.traceId },
  });
});
