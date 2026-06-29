import { z } from 'zod';
import { LEDGER_ACCOUNT_CATEGORY_VALUES } from '../constants/ledger-account-category.constant';
import { LEDGER_ACCOUNT_STATUS_VALUES } from '../constants/ledger-account-status.constant';
import { LEDGER_ACCOUNT_TYPE_VALUES } from '../constants/ledger-account-type.constant';

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

export const createLedgerAccountBodyValidator = z.object({
  accountCode: z.string().trim().min(1).max(64),
  accountName: z.string().trim().min(1).max(128),
  accountType: z.enum(LEDGER_ACCOUNT_TYPE_VALUES as [string, ...string[]]),
  accountCategory: z.enum(LEDGER_ACCOUNT_CATEGORY_VALUES as [string, ...string[]]),
  currency: z.string().trim().min(3).max(3).optional(),
  description: z.string().trim().max(512).nullable().optional(),
  isPostingAllowed: z.boolean().optional(),
  parentAccountId: objectIdString.nullable().optional(),
});

export const updateLedgerAccountBodyValidator = z.object({
  accountName: z.string().trim().min(1).max(128).optional(),
  description: z.string().trim().max(512).nullable().optional(),
  status: z.enum(LEDGER_ACCOUNT_STATUS_VALUES as [string, ...string[]]).optional(),
  isPostingAllowed: z.boolean().optional(),
  parentAccountId: objectIdString.nullable().optional(),
});

export const ledgerAccountIdParamsValidator = z.object({
  accountId: objectIdString,
});

export const listLedgerAccountsQueryValidator = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  accountType: z.enum(LEDGER_ACCOUNT_TYPE_VALUES as [string, ...string[]]).optional(),
  accountCategory: z.enum(LEDGER_ACCOUNT_CATEGORY_VALUES as [string, ...string[]]).optional(),
  currency: z.string().trim().min(3).max(3).optional(),
  status: z.enum(LEDGER_ACCOUNT_STATUS_VALUES as [string, ...string[]]).optional(),
  isSystemAccount: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  isPostingAllowed: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  parentAccountId: objectIdString.optional(),
  search: z.string().trim().min(1).optional(),
});
