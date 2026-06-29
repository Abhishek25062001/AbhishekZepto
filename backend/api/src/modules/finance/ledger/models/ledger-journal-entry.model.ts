import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import {
  LEDGER_JOURNAL_STATUS,
  LEDGER_JOURNAL_STATUS_VALUES,
  type LedgerJournalStatus,
} from '../constants/ledger-journal-status.constant';
import {
  LEDGER_POSTING_TYPE_VALUES,
  type LedgerPostingType,
} from '../constants/ledger-posting-type.constant';
import {
  LEDGER_SOURCE_TYPE_VALUES,
  type LedgerSourceType,
} from '../constants/ledger-source-type.constant';
import type { LedgerJournalEntryRecord } from '../types/ledger.types';

const LedgerJournalEntrySchema = new Schema<LedgerJournalEntryRecord>(
  {
    journalCode: { type: String, required: true, trim: true, unique: true, index: true },
    sourceType: {
      type: String,
      enum: LEDGER_SOURCE_TYPE_VALUES,
      required: true,
      index: true,
    },
    sourceId: { type: Schema.Types.ObjectId, default: null, index: true },
    sourceCode: { type: String, default: null, trim: true },
    postingType: {
      type: String,
      enum: LEDGER_POSTING_TYPE_VALUES,
      required: true,
      index: true,
    },
    idempotencyKey: { type: String, required: true, trim: true, unique: true, index: true },
    currency: { type: String, required: true, trim: true, default: 'INR' },
    totalDebit: { type: Number, required: true, min: 0, default: 0 },
    totalCredit: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: LEDGER_JOURNAL_STATUS_VALUES,
      default: LEDGER_JOURNAL_STATUS.DRAFT,
      index: true,
    },
    reversalOfJournalId: { type: Schema.Types.ObjectId, default: null, index: true },
    reversedByJournalId: { type: Schema.Types.ObjectId, default: null, index: true },
    postedBy: { type: Schema.Types.ObjectId, default: null },
    postedAt: { type: Date, default: null, index: true },
    reversedBy: { type: Schema.Types.ObjectId, default: null },
    reversedAt: { type: Date, default: null },
    description: { type: String, default: null, trim: true },
    metadata: { type: Schema.Types.Mixed, default: null },
    createdBy: { type: Schema.Types.ObjectId, default: null },
  },
  baseSchemaOptions as SchemaOptions<LedgerJournalEntryRecord>,
);

LedgerJournalEntrySchema.index({ createdAt: -1 });

export const LedgerJournalEntryModel = model<LedgerJournalEntryRecord>(
  'LedgerJournalEntry',
  LedgerJournalEntrySchema,
  COLLECTION_NAMES.LEDGER_JOURNAL_ENTRIES,
);

export type LedgerJournalEntryDocument = LedgerJournalEntryRecord & {
  _id: Types.ObjectId;
};

export type { LedgerJournalStatus, LedgerPostingType, LedgerSourceType };
