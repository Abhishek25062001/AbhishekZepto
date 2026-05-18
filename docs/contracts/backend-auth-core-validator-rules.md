# Backend Auth Core Validator Rules

## Goal

Document the planned auth validator updates for Backend Auth Core.

## Planned File Path

- `/backend/api/src/modules/auth/validators/auth.validators.ts`

## requestOtpValidator

- Add `purpose`
- Allowed values:
  `login`, `signup`, `reauth`
- Add `deliveryChannel`
- Allowed values:
  `sms`, `whatsapp`, `email`
- Make `purpose` optional with default `login`
- Make `deliveryChannel` optional with default `sms`

## verifyOtpValidator

- Add `challengeId`
- Add `device`

### device

- `deviceId` as optional string
- `deviceType` as required enum:
  `android`, `ios`, `web`, `unknown`
- `appSurface` as required enum:
  `customer_app`, `delivery_agent_app`, `vendor_panel`, `admin_dashboard`
- `appVersion` as optional string

## refreshTokenValidator

- Ensure `refreshToken` is required string

## logoutValidator

- Ensure `refreshToken` is required string
- Add optional boolean `logoutAllDevices`

## Corrective Role & Permission Validators

Corrective Ticket 2 adds the missing validator layer for the pending Role &
Permission System admin APIs.

### Planned/implemented file paths

- `/backend/api/src/modules/auth/validators/role.validators.ts`
- `/backend/api/src/modules/auth/validators/user-permission.validators.ts`
- `/backend/api/src/modules/auth/validators/index.ts`

### role.validators.ts

- `createRoleValidator`
  - body fields:
    - `code`
    - `name`
    - `description`
    - `permissions`
    - `isEditable`
- `updateRoleValidator`
  - partial body fields:
    - `name`
    - `description`
    - `permissions`
    - `isEditable`
    - `status`
- `listRolesValidator`
  - query fields:
    - `status`
    - `search`
    - `page`
    - `limit`
- `roleIdParamValidator`
  - param field:
    - `roleId`

### user-permission.validators.ts

- `userIdParamValidator`
  - param field:
    - `userId`
- `updateUserPermissionsValidator`
  - body fields:
    - `permissions`
- `assignUserRoleValidator`
  - body fields:
    - `role`
- `syncUserRolePermissionsValidator`
  - body fields:
    - `roleCode`

### Permission validation rule

- Permission strings are validated through the current
  `isPermissionCode()` utility in:
  `/backend/api/src/modules/auth/utils/permission-code.util.ts`

### Related API families

- `GET /api/v1/admin/roles`
- `POST /api/v1/admin/roles`
- `GET /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/roles/:roleId`
- `DELETE /api/v1/admin/roles/:roleId`
- `PATCH /api/v1/admin/users/:userId/permissions`
- `PATCH /api/v1/admin/users/:userId/role`
- `POST /api/v1/admin/users/:userId/sync-role-permissions`

### Verification note

- Validator-focused automated backend tests are still `NEEDS VERIFICATION`
  because this repository does not yet expose an established validator test
  pattern under `backend/api`.
