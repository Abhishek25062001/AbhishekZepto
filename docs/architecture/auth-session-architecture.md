# Auth Session Architecture

## Session Goal

Each successful OTP verification creates a session record.

## Collection

- `auth_sessions`

## Planned Model File

- `/backend/api/src/modules/auth/models/auth-session.model.ts`

## Session Lifecycle

- `created`
- `active`
- `refreshed`
- `revoked`
- `expired`

## DB Fields

- `userId: ObjectId`
- `role: AuthRole`
- `refreshTokenHash: string`
- `deviceId: string | null`
- `deviceType: android | ios | web | unknown`
- `appSurface: customer_app | delivery_agent_app | vendor_panel | admin_dashboard`
- `appVersion: string | null`
- `ipAddress: string | null`
- `userAgent: string | null`
- `expiresAt: Date`
- `revokedAt: Date | null`
- `revokedReason: string | null`
- `lastUsedAt: Date | null`
- `isRevoked: boolean`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Indexes

- Active session lookup index: `userId + isRevoked`
- Refresh token lookup index: `refreshTokenHash`
- Expiry lookup index: `expiresAt`

## API Endpoints

- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## DB Field Inventory

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
