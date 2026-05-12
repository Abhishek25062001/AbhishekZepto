# Phase 1 Database Review

## Review Goal

Validate Phase 1 database foundation consistency.

## Verified Database Foundation Files

- `/backend/api/src/config/database.ts`
- `/backend/api/src/database/base-schema-options.ts`
- `/backend/api/src/database/base-schema-fields.ts`
- `/backend/api/src/database/constants/db-status.constants.ts`
- `/backend/api/src/database/constants/collection-names.constants.ts`
- `/backend/api/src/database/pagination.ts`
- `/backend/api/src/database/database-error.mapper.ts`
- `/backend/api/src/database/seeds/seed-runner.ts`

## Verified DB Models

- `/backend/api/src/modules/auth/models/user-identity.model.ts`
- `/backend/api/src/modules/auth/models/auth-session.model.ts`
- `/backend/api/src/modules/auth/models/role.model.ts`
- `/backend/api/src/modules/audit/models/audit-log.model.ts`
- `/backend/api/src/modules/system/models/system-check.model.ts`

## Verified DB Field Lists

`user_identities` includes:

- `phone`
- `email`
- `name`
- `role`
- `accountStatus`
- `permissions`
- `vendorId`
- `storeId`
- `cityId`
- `lastLoginAt`
- `createdBy`
- `updatedBy`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

`auth_sessions` includes:

- `userId`
- `role`
- `refreshTokenHash`
- `deviceId`
- `deviceType`
- `appSurface`
- `appVersion`
- `ipAddress`
- `userAgent`
- `expiresAt`
- `revokedAt`
- `revokedReason`
- `lastUsedAt`
- `isRevoked`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

`roles` includes:

- `code`
- `name`
- `description`
- `permissions`
- `isSystemRole`
- `isEditable`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

`audit_logs` includes:

- `eventType`
- `actorId`
- `actorRole`
- `actorSurface`
- `entityType`
- `entityId`
- `vendorId`
- `storeId`
- `cityId`
- `requestId`
- `traceId`
- `ipAddress`
- `userAgent`
- `metadata`
- `status`
- `createdAt`
- `updatedAt`

`system_checks` includes:

- `key`
- `value`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Seed Verification Result

Passed:

```bash
npm run seed:dry -w backend/api
```

Dry-run confirmed role seed coverage for:

- `customer`
- `delivery_agent`
- `vendor_owner`
- `store_manager`
- `store_staff`
- `support_admin`
- `operations_admin`
- `super_admin`

Blocked:

```bash
npm run seed -w backend/api
```

The real seed command failed because the configured MongoDB Atlas SRV target was
not reachable from this machine/network.

## API Endpoints Used For DB Verification

- `GET /api/v1/public/health`
- `POST /api/v1/internal/system/database-write-check`
