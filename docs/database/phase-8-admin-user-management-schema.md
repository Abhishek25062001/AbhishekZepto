# Phase 8 Module 3 — Admin User Management Schema

## Status

Implemented on top of existing `user_identities` records.

## Source Of Truth

Admin users are represented by existing auth `UserIdentity` records whose role
is one of:

- `support_admin`
- `operations_admin`
- `super_admin`

## Implemented Fields

- `adminId` / `userId`: existing `UserIdentity._id`.
- `name`
- `email`
- `phone`
- `role`
- `permissions`
- `status`: mapped from `accountStatus`.
- `cityScope`: represented by existing `cityId`.
- `storeScope`: represented by existing `storeId`.
- `createdBy`
- `updatedBy`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

## Deferred Fields

The existing auth identity model does not have dedicated fields for
`disabledAt`, `disabledBy`, or `disableReason`. Module 3 response mapping
derives disabled metadata from status and update metadata until a future schema
ticket explicitly adds dedicated fields.

## Ownership Boundary

Password, token, OTP, and session secrets remain owned by the existing auth
module. Module 3 manages admin identity metadata, role, status, permission, and
scope only.

## Audit Storage

Admin-user mutation audit entries are stored in the existing
`admin_action_audits` collection with `entityType = admin_user`.
