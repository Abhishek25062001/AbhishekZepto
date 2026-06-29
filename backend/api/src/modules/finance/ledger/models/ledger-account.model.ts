import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../../database/constants/collection-names.constants';
import {
  LEDGER_ACCOUNT_CATEGORY_VALUES,
  type LedgerAccountCategory,
} from '../constants/ledger-account-category.constant';
import {
  LEDGER_ACCOUNT_STATUS,
  LEDGER_ACCOUNT_STATUS_VALUES,
  type LedgerAccountStatus,
} from '../constants/ledger-account-status.constant';
import {
  LEDGER_ACCOUNT_TYPE_VALUES,
  type LedgerAccountType,
} from '../constants/ledger-account-type.constant';
import type { LedgerAccountRecord } from '../types/ledger.types';

const LedgerAccountSchema = new Schema<LedgerAccountRecord>(
  {
    accountCode: { type: String, required: true, trim: true, uppercase: true },
    accountName: { type: String, required: true, trim: true },
    accountType: {
      type: String,
      enum: LEDGER_ACCOUNT_TYPE_VALUES,
      required: true,
      index: true,
    },
    accountCategory: {
      type: String,
      enum: LEDGER_ACCOUNT_CATEGORY_VALUES,
      required: true,
      index: true,
    },
    currency: { type: String, required: true, trim: true, default: 'INR', index: true },
    description: { type: String, default: null, trim: true },
    isSystemAccount: { type: Boolean, default: false, index: true },
    isPostingAllowed: { type: Boolean, default: true, index: true },
    parentAccountId: { type: Schema.Types.ObjectId, default: null, index: true },
    status: {
      type: String,
      enum: LEDGER_ACCOUNT_STATUS_VALUES,
      default: LEDGER_ACCOUNT_STATUS.ACTIVE,
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
    isDeleted: baseSchemaFields.isDeleted,
    deletedAt: baseSchemaFields.deletedAt,
  },
  baseSchemaOptions as SchemaOptions<LedgerAccountRecord>,
);

LedgerAccountSchema.index(
  { accountCode: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
LedgerAccountSchema.index({ createdAt: -1 });

export const LedgerAccountModel = model<LedgerAccountRecord>(
  'LedgerAccount',
  LedgerAccountSchema,
  COLLECTION_NAMES.LEDGER_ACCOUNTS,
);

export type LedgerAccountDocument = LedgerAccountRecord & {
  _id: Types.ObjectId;
};

export type { LedgerAccountCategory, LedgerAccountStatus, LedgerAccountType };
