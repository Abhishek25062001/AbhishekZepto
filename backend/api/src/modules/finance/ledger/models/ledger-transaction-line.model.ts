import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import {
  LEDGER_ACCOUNT_TYPE_VALUES,
  type LedgerAccountType,
} from '../constants/ledger-account-type.constant';
import {
  LEDGER_POSTING_TYPE_VALUES,
  type LedgerPostingType,
} from '../constants/ledger-posting-type.constant';
import {
  LEDGER_SOURCE_TYPE_VALUES,
  type LedgerSourceType,
} from '../constants/ledger-source-type.constant';
import type { LedgerTransactionLineRecord } from '../types/ledger.types';

const validateLineAmounts = function validateLineAmounts(this: LedgerTransactionLineRecord): boolean {
  const debit = this.debitAmount ?? 0;
  const credit = this.creditAmount ?? 0;

  if (debit < 0 || credit < 0) {
    return false;
  }

  if (debit > 0 && credit > 0) {
    return false;
  }

  if (debit === 0 && credit === 0) {
    return false;
  }

  return true;
};

const LedgerTransactionLineSchema = new Schema<LedgerTransactionLineRecord>(
  {
    journalEntryId: { type: Schema.Types.ObjectId, required: true, index: true },
    journalCode: { type: String, required: true, trim: true, index: true },
    accountId: { type: Schema.Types.ObjectId, required: true, index: true },
    accountCode: { type: String, required: true, trim: true, uppercase: true, index: true },
    accountType: {
      type: String,
      enum: LEDGER_ACCOUNT_TYPE_VALUES,
      required: true,
    },
    debitAmount: { type: Number, required: true, min: 0, default: 0 },
    creditAmount: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, required: true, trim: true, default: 'INR' },
    description: { type: String, default: null, trim: true },
    sourceType: {
      type: String,
      enum: LEDGER_SOURCE_TYPE_VALUES,
      required: true,
      index: true,
    },
    sourceId: { type: Schema.Types.ObjectId, default: null, index: true },
    postingType: {
      type: String,
      enum: LEDGER_POSTING_TYPE_VALUES,
      required: true,
      index: true,
    },
    lineMetadata: { type: Schema.Types.Mixed, default: null },
  },
  baseSchemaOptions as SchemaOptions<LedgerTransactionLineRecord>,
);

LedgerTransactionLineSchema.path('debitAmount').validate(validateLineAmounts);
LedgerTransactionLineSchema.index({ createdAt: -1 });

export const LedgerTransactionLineModel = model<LedgerTransactionLineRecord>(
  'LedgerTransactionLine',
  LedgerTransactionLineSchema,
  COLLECTION_NAMES.LEDGER_TRANSACTION_LINES,
);

export type LedgerTransactionLineDocument = LedgerTransactionLineRecord & {
  _id: Types.ObjectId;
};

export type { LedgerAccountType, LedgerPostingType, LedgerSourceType };
