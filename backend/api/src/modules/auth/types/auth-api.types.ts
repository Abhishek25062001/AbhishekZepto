import type { AuthRole } from './auth-role.types';
import type {
  AuthDeviceInput,
  AuthUserResponse,
  OtpDeliveryChannel,
  OtpPurpose,
} from './otp.types';

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
  deviceType: 'android' | 'ios' | 'web' | 'unknown';
  appSurface:
    | 'customer_app'
    | 'delivery_agent_app'
    | 'vendor_panel'
    | 'admin_dashboard';
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

export type AdminAuthSessionSummary = Omit<AuthSessionSummary, 'isCurrent'>;

export type ListAdminUserSessionsResponse = {
  userId: string;
  sessions: AdminAuthSessionSummary[];
};

export type RevokeAdminUserSessionResponse = {
  sessionId: string;
  userId: string;
  alreadyRevoked: boolean;
};

export type RevokeAllAdminUserSessionsResponse = {
  userId: string;
  revokedCount: number;
};

export type LogoutSessionBody = {
  sessionId: string;
};

export type LogoutOtherSessionsBody = {
  currentSessionId?: string;
};
