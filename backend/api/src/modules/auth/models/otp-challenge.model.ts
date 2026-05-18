import { model, Schema } from 'mongoose';
import type { SchemaOptions } from 'mongoose';
import { baseSchemaFields } from '../../../database/base-schema-fields';
import { baseSchemaOptions } from '../../../database/base-schema-options';
import { COLLECTION_NAMES } from '../../../database/constants/collection-names.constants';
import {
  OTP_DELIVERY_CHANNELS,
  OTP_PURPOSES,
} from '../constants/auth-otp.constants';
import { AUTH_ROLES } from '../constants/auth-role.constants';
import type { AuthRole } from '../types/auth-role.types';
import type { OtpDeliveryChannel, OtpPurpose } from '../types/otp.types';

export type OtpChallengeRecord = {
  phone: string;
  role: AuthRole;
  otpHash: string;
  purpose: OtpPurpose;
  deliveryChannel: OtpDeliveryChannel;
  deliveryTarget: string;
  expiresAt: Date;
  attemptCount: number;
  maxAttempts: number;
  resendCount: number;
  maxResends: number;
  lastSentAt: Date;
  verifiedAt: Date | null;
  blockedUntil: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
  requestId: string | null;
  traceId: string | null;
  status: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const OtpChallengeSchema = new Schema<OtpChallengeRecord>(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: AUTH_ROLES,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: OTP_PURPOSES,
      required: true,
      default: OTP_PURPOSES[0],
      index: true,
    },
    deliveryChannel: {
      type: String,
      enum: OTP_DELIVERY_CHANNELS,
      required: true,
      default: OTP_DELIVERY_CHANNELS[0],
    },
    deliveryTarget: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    attemptCount: {
      type: Number,
      required: true,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      required: true,
      default: 5,
    },
    resendCount: {
      type: Number,
      required: true,
      default: 0,
    },
    maxResends: {
      type: Number,
      required: true,
      default: 3,
    },
    lastSentAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    blockedUntil: {
      type: Date,
      default: null,
      index: true,
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
    requestId: {
      type: String,
      default: null,
      trim: true,
    },
    traceId: {
      type: String,
      default: null,
      trim: true,
    },
    ...baseSchemaFields,
  },
  baseSchemaOptions as SchemaOptions<OtpChallengeRecord>,
);

OtpChallengeSchema.index({ phone: 1, role: 1, purpose: 1, createdAt: -1 });
OtpChallengeSchema.index({ verifiedAt: 1, expiresAt: 1 });

export const OtpChallengeModel = model<OtpChallengeRecord>(
  'OtpChallenge',
  OtpChallengeSchema,
  COLLECTION_NAMES.OTP_CHALLENGES,
);
