# Phase 1 Database Review Complete

## Verified DB Models

- `user_identities`
- `auth_sessions`
- `roles`
- `audit_logs`
- `system_checks`

## Verified DB Field Lists

- `user_identities`: `phone`, `email`, `name`, `role`, `accountStatus`,
  `permissions`, `vendorId`, `storeId`, `cityId`, `lastLoginAt`, `createdBy`,
  `updatedBy`, `status`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`
- `auth_sessions`: `userId`, `role`, `refreshTokenHash`, `deviceId`,
  `deviceType`, `appSurface`, `appVersion`, `ipAddress`, `userAgent`,
  `expiresAt`, `revokedAt`, `revokedReason`, `lastUsedAt`, `isRevoked`,
  `status`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`
- `roles`: `code`, `name`, `description`, `permissions`, `isSystemRole`,
  `isEditable`, `status`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`
- `audit_logs`: `eventType`, `actorId`, `actorRole`, `actorSurface`,
  `entityType`, `entityId`, `vendorId`, `storeId`, `cityId`, `requestId`,
  `traceId`, `ipAddress`, `userAgent`, `metadata`, `status`, `createdAt`,
  `updatedAt`
- `system_checks`: `key`, `value`, `status`, `isDeleted`, `deletedAt`,
  `createdAt`, `updatedAt`

## Seed Verification Result

- `npm run seed:dry -w backend/api` passed.
- `npm run seed -w backend/api` is blocked until MongoDB is reachable from this
  machine/network.

## API Endpoints Used For DB Verification

- `GET /api/v1/public/health`
- `POST /api/v1/internal/system/database-write-check`
