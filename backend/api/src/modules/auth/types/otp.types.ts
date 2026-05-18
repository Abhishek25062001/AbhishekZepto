import type { Types } from 'mongoose';
import type {
  AUTH_APP_SURFACE,
  AUTH_DEVICE_TYPE,
  OTP_DELIVERY_CHANNEL,
  OTP_PURPOSE,
} from '../constants/auth-otp.constants';
import type { AuthRole } from './auth-role.types';
import type { PermissionCode } from './auth-permission.types';

export type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

export type OtpDeliveryChannel =
  (typeof OTP_DELIVERY_CHANNEL)[keyof typeof OTP_DELIVERY_CHANNEL];

export type AuthDeviceType = (typeof AUTH_DEVICE_TYPE)[keyof typeof AUTH_DEVICE_TYPE];

export type AuthAppSurface = (typeof AUTH_APP_SURFACE)[keyof typeof AUTH_APP_SURFACE];

export type AuthDeviceInput = {
  deviceId?: string;
  deviceType: AuthDeviceType;
  appSurface: AuthAppSurface;
  appVersion?: string;
};

export type CreateOtpChallengeInput = {
  phone: string;
  role: AuthRole;
  otpHash: string;
  purpose: OtpPurpose;
  deliveryChannel: OtpDeliveryChannel;
  deliveryTarget: string;
  expiresAt: Date;
  attemptCount?: number;
  maxAttempts?: number;
  resendCount?: number;
  maxResends?: number;
  lastSentAt?: Date;
  verifiedAt?: Date | null;
  blockedUntil?: Date | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  traceId?: string | null;
};

export type AuthUserResponse = {
  userId: string;
  role: AuthRole;
  permissions: PermissionCode[];
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
};

export type OtpChallengePublicResult = {
  challengeId: string;
  expiresIn: number;
  canResendAfter: number;
  deliveryChannel: OtpDeliveryChannel;
  maskedTarget: string;
};

export type AuthAuditContext = {
  requestId?: string;
  traceId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type OptionalObjectId = Types.ObjectId | null | undefined;
