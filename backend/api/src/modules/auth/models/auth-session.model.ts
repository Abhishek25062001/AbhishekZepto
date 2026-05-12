import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import { AUTH_ROLES } from '../constants/auth-role.constants';
import type { AuthRole } from '../types/auth-role.types';

export type AuthDeviceType = 'android' | 'ios' | 'web' | 'unknown';

export type AuthAppSurface =
  | 'customer_app'
  | 'delivery_agent_app'
  | 'vendor_panel'
  | 'admin_dashboard';

export type AuthSessionRecord = {
  userId: Types.ObjectId;
  role: AuthRole;
  refreshTokenHash: string;
  deviceId: string | null;
  deviceType: AuthDeviceType;
  appSurface: AuthAppSurface;
  appVersion: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  revokedReason: string | null;
  lastUsedAt: Date | null;
  isRevoked: boolean;
  status: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const AuthSessionSchema = new Schema<AuthSessionRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: AUTH_ROLES,
      required: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      default: null,
      trim: true,
    },
    deviceType: {
      type: String,
      enum: ['android', 'ios', 'web', 'unknown'],
      default: 'unknown',
    },
    appSurface: {
      type: String,
      enum: ['customer_app', 'delivery_agent_app', 'vendor_panel', 'admin_dashboard'],
      required: true,
    },
    appVersion: {
      type: String,
      default: null,
      trim: true,
    },
    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },
    userAgent: {
      type: String,
      default: null,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    revokedReason: {
      type: String,
      default: null,
      trim: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    ...baseSchemaFields,
  },
  baseSchemaOptions as SchemaOptions<AuthSessionRecord>,
);

AuthSessionSchema.index({ userId: 1, isRevoked: 1 });

export const AuthSessionModel = model<AuthSessionRecord>(
  'AuthSession',
  AuthSessionSchema,
  COLLECTION_NAMES.AUTH_SESSIONS,
);
