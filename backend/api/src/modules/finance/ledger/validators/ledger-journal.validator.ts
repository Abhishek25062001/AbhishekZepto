import { z } from 'zod';
import { LEDGER_JOURNAL_STATUS_VALUES } from '../constants/ledger-journal-status.constant';
import { LEDGER_POSTING_TYPE_VALUES } from '../constants/ledger-posting-type.constant';
import { LEDGER_SOURCE_TYPE_VALUES } from '../constants/ledger-source-type.constant';

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

export const listLedgerJournalsQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sourceType: z.enum(LEDGER_SOURCE_TYPE_VALUES as [string, ...string[]]).optional(),
  sourceId: objectIdString.optional(),
  postingType: z.enum(LEDGER_POSTING_TYPE_VALUES as [string, ...string[]]).optional(),
  status: z.enum(LEDGER_JOURNAL_STATUS_VALUES as [string, ...string[]]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().trim().min(1).optional(),
});

export const ledgerJournalIdParamsValidator = z.object({
  journalId: objectIdString,
});

export const reverseJournalBodyValidator = z.object({
  reason: z.string().trim().min(1).max(512),
});

export const listAccountLinesQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sourceType: z.enum(LEDGER_SOURCE_TYPE_VALUES as [string, ...string[]]).optional(),
  sourceId: objectIdString.optional(),
  postingType: z.enum(LEDGER_POSTING_TYPE_VALUES as [string, ...string[]]).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});
