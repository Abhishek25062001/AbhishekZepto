import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { AUTH_ROLES } from '../constants/auth-role.constants';
import {
  AUTH_ACCOUNT_STATUS,
  AUTH_ACCOUNT_STATUSES,
} from '../constants/auth-status.constants';
import type { AuthRole } from '../types/auth-role.types';
import type { AuthAccountStatus } from '../types/auth-status.types';

export type UserIdentityRecord = {
  phone: string;
  email: string | null;
  name: string | null;
  role: AuthRole;
  accountStatus: AuthAccountStatus;
  permissions: string[];
  vendorId: Types.ObjectId | null;
  storeId: Types.ObjectId | null;
  cityId: Types.ObjectId | null;
  lastLoginAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  status: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const UserIdentitySchema = new Schema<UserIdentityRecord>(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: String,
      enum: AUTH_ROLES,
      required: true,
      index: true,
    },
    accountStatus: {
      type: String,
      enum: AUTH_ACCOUNT_STATUSES,
      default: AUTH_ACCOUNT_STATUS.ACTIVE,
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    ...baseSchemaFields,
  },
  baseSchemaOptions as SchemaOptions<UserIdentityRecord>,
);

UserIdentitySchema.index({ phone: 1, role: 1 }, { unique: true, sparse: true });
UserIdentitySchema.index({ email: 1 }, { sparse: true });
UserIdentitySchema.index({ vendorId: 1, storeId: 1, role: 1 });

export const UserIdentityModel = model<UserIdentityRecord>(
  'UserIdentity',
  UserIdentitySchema,
  COLLECTION_NAMES.USER_IDENTITIES,
);
