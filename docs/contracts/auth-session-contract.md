# Auth Session Contract

## Contract Goal

Document the session object shape used internally by the backend.

## Collection

- `auth_sessions`

## Internal Session Shape

```ts
type AuthSessionContract = {
  id: string;
  userId: string;
  role: AuthRole;
  refreshTokenHash: string;
  deviceId: string | null;
  deviceType: 'android' | 'ios' | 'web' | 'unknown';
  appSurface:
    | 'customer_app'
    | 'delivery_agent_app'
    | 'vendor_panel'
    | 'admin_dashboard';
  appVersion: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
  lastUsedAt: string | null;
  isRevoked: boolean;
  status: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
```

## API Endpoints

- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Fields

- `auth_sessions.userId`
- `auth_sessions.role`
- `auth_sessions.refreshTokenHash`
- `auth_sessions.deviceId`
- `auth_sessions.deviceType`
- `auth_sessions.appSurface`
- `auth_sessions.appVersion`
- `auth_sessions.ipAddress`
- `auth_sessions.userAgent`
- `auth_sessions.expiresAt`
- `auth_sessions.revokedAt`
- `auth_sessions.revokedReason`
- `auth_sessions.lastUsedAt`
- `auth_sessions.isRevoked`
- `auth_sessions.status`
- `auth_sessions.isDeleted`
- `auth_sessions.deletedAt`
- `auth_sessions.createdAt`
- `auth_sessions.updatedAt`
