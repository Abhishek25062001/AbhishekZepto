import type { PermissionCode } from './permission.types';

export type AuthRole =
  | 'customer'
  | 'delivery_agent'
  | 'vendor_owner'
  | 'store_manager'
  | 'store_staff'
  | 'support_admin'
  | 'operations_admin'
  | 'super_admin';

export type AuthScope = {
  vendorId: string | null;
  storeId: string | null;
  cityId: string | null;
};

export type OtpPurpose = 'login' | 'signup' | 'reauth';

export type OtpDeliveryChannel = 'sms' | 'whatsapp' | 'email';

export type AuthDeviceType = 'android' | 'ios' | 'web' | 'unknown';

export type AppSurface =
  | 'customer_app'
  | 'delivery_agent_app'
  | 'vendor_panel'
  | 'admin_dashboard';

export type AuthDeviceInput = {
  deviceId?: string;
  deviceType: AuthDeviceType;
  appSurface: AppSurface;
  appVersion?: string;
};

export type RequestOtpBody = {
  phone: string;
  role: AuthRole;
  purpose?: OtpPurpose;
  deliveryChannel?: OtpDeliveryChannel;
};

export type RequestOtpResponse = {
  challengeId: string;
  expiresIn: number;
  canResendAfter: number;
  deliveryChannel: OtpDeliveryChannel;
  maskedTarget: string;
};

export type VerifyOtpBody = {
  phone: string;
  role: AuthRole;
  otp: string;
  challengeId: string;
  device: AuthDeviceInput;
};

export type AuthUserResponse = AuthScope & {
  userId: string;
  role: AuthRole;
  permissions: PermissionCode[];
};

export type VerifyOtpResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUserResponse;
};

export type RefreshTokenBody = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type LogoutBody = {
  refreshToken: string;
  logoutAllDevices?: boolean;
};

export type AuthSessionSummary = {
  id: string;
  role: AuthRole;
  deviceId: string | null;
  deviceName: string | null;
  deviceType: AuthDeviceType;
  appSurface: AppSurface;
  appVersion: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastUsedAt: string | null;
  expiresAt: string;
  isCurrent: boolean;
  isRevoked: boolean;
  revokedAt: string | null;
  revokedReason: string | null;
  createdAt: string;
};

export type ListMySessionsResponse = {
  sessions: AuthSessionSummary[];
};

export type LogoutSessionBody = {
  sessionId: string;
};

export type LogoutOtherSessionsBody = {
  currentSessionId?: string;
};

export type AdminAuthSessionSummary = Omit<AuthSessionSummary, 'isCurrent'>;

export type ListAdminUserSessionsResponse = {
  userId: string;
  sessions: AdminAuthSessionSummary[];
};

export type RevokeAdminUserSessionResponse = {
  userId: string;
  sessionId: string;
  alreadyRevoked: boolean;
};

export type RevokeAllAdminUserSessionsResponse = {
  userId: string;
  revokedCount: number;
};

export type AuthErrorCode =
  | 'USER_NOT_FOUND'
  | 'ACCOUNT_BLOCKED'
  | 'ACCOUNT_INACTIVE'
  | 'ACCOUNT_PENDING_APPROVAL'
  | 'RATE_LIMITED'
  | 'INVALID_OTP'
  | 'OTP_EXPIRED'
  | 'OTP_ATTEMPTS_EXCEEDED'
  | 'OTP_RESEND_LIMIT_EXCEEDED'
  | 'INVALID_REFRESH_TOKEN'
  | 'INVALID_ACCESS_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'SESSION_REVOKED'
  | 'SESSION_EXPIRED'
  | 'SESSION_NOT_FOUND'
  | 'SESSION_ACCESS_DENIED'
  | 'ROLE_NOT_ALLOWED'
  | 'VALIDATION_ERROR';
