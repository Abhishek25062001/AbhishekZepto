# Phase 8 Module 4 — Customer Management Schema

## Status

Implemented.

## Existing Customer Identity Fields

Customer identity remains owned by auth `UserIdentity` records with
`role = customer`.

Admin-visible identity fields:

- `customerId`
- `userId`
- `name`
- `phone`
- `email`
- `accountStatus`
- `cityId`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

## Customer Admin Profile Fields

Module 4 adds `customer_admin_profiles` for admin-only customer metadata:

- `customerId`
- `riskStatus`
- `adminNotes`
- `blockedAt`
- `blockedBy`
- `blockReason`
- `updatedBy`
- `createdAt`
- `updatedAt`

## Ownership Boundary

Customer-facing profile changes remain outside Module 4. Module 4 manages only
admin-facing status, risk, notes, and inspection metadata.
