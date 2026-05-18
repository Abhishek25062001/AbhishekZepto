import { model, Schema, Types } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  AUTH_APP_SURFACES,
  AUTH_DEVICE_TYPES,
} from '../constants/auth-otp.constants';
import { AUTH_ROLES } from '../constants/auth-role.constants';
import type { AuthRole } from '../types/auth-role.types';
import type { AuthAppSurface, AuthDeviceType } from '../types/otp.types';

export type AuthSessionRecord = {
  userId: Types.ObjectId;
  role: AuthRole;
  refreshTokenHash: string;
  refreshTokenRotatedAt: Date | null;
  deviceId: string | null;
  deviceName: string | null;
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
    refreshTokenRotatedAt: {
      type: Date,
      default: null,
    },
    deviceId: {
      type: String,
      default: null,
      trim: true,
    },
    deviceName: {
      type: String,
      default: null,
      trim: true,
    },
    deviceType: {
      type: String,
      enum: AUTH_DEVICE_TYPES,
      default: AUTH_DEVICE_TYPES[3],
    },
    appSurface: {
      type: String,
      enum: AUTH_APP_SURFACES,
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
