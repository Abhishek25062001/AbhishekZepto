import { Router } from 'express';
import { validateRequest } from '../../../../middlewares/validate-request.middleware';
import { requirePermission } from '../../../auth/middlewares/require-permission.middleware';
import { LEDGER_PERMISSIONS } from '../constants/ledger-permissions.constants';
import {
  archiveLedgerAccountController,
  createLedgerAccountController,
  getLedgerAccountByIdController,
  listAccountLinesController,
  listLedgerAccountsController,
  updateLedgerAccountController,
} from '../controllers/ledger-account.controller';
import {
  getLedgerJournalByIdController,
  listLedgerJournalsController,
  reverseLedgerJournalController,
} from '../controllers/ledger-journal.controller';
import {
  createLedgerAccountBodyValidator,
  ledgerAccountIdParamsValidator,
  listLedgerAccountsQueryValidator,
  updateLedgerAccountBodyValidator,
} from '../validators/ledger-account.validator';
import {
  ledgerJournalIdParamsValidator,
  listAccountLinesQueryValidator,
  listLedgerJournalsQueryValidator,
  reverseJournalBodyValidator,
} from '../validators/ledger-journal.validator';

const router = Router();

router.get(
  '/accounts',
  requirePermission(LEDGER_PERMISSIONS.READ),
  validateRequest({ query: listLedgerAccountsQueryValidator }),
  listLedgerAccountsController,
);

router.post(
  '/accounts',
  requirePermission(LEDGER_PERMISSIONS.MANAGE_ACCOUNTS),
  validateRequest({ body: createLedgerAccountBodyValidator }),
  createLedgerAccountController,
);

router.get(
  '/accounts/:accountId',
  requirePermission(LEDGER_PERMISSIONS.READ),
  validateRequest({ params: ledgerAccountIdParamsValidator }),
  getLedgerAccountByIdController,
);

router.patch(
  '/accounts/:accountId',
  requirePermission(LEDGER_PERMISSIONS.MANAGE_ACCOUNTS),
  validateRequest({ params: ledgerAccountIdParamsValidator }),
  validateRequest({ body: updateLedgerAccountBodyValidator }),
  updateLedgerAccountController,
);

router.delete(
  '/accounts/:accountId',
  requirePermission(LEDGER_PERMISSIONS.MANAGE_ACCOUNTS),
  validateRequest({ params: ledgerAccountIdParamsValidator }),
  archiveLedgerAccountController,
);

router.get(
  '/accounts/:accountId/lines',
  requirePermission(LEDGER_PERMISSIONS.READ),
  validateRequest({ params: ledgerAccountIdParamsValidator }),
  validateRequest({ query: listAccountLinesQueryValidator }),
  listAccountLinesController,
);

router.get(
  '/journals',
  requirePermission(LEDGER_PERMISSIONS.READ),
  validateRequest({ query: listLedgerJournalsQueryValidator }),
  listLedgerJournalsController,
);

router.get(
  '/journals/:journalId',
  requirePermission(LEDGER_PERMISSIONS.READ),
  validateRequest({ params: ledgerJournalIdParamsValidator }),
  getLedgerJournalByIdController,
);

router.post(
  '/journals/:journalId/reverse',
  requirePermission(LEDGER_PERMISSIONS.REVERSE),
  validateRequest({ params: ledgerJournalIdParamsValidator }),
  validateRequest({ body: reverseJournalBodyValidator }),
  reverseLedgerJournalController,
);

export default router;
