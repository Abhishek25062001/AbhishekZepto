# Customer Profile Schema (Phase 4)

## Collection

`user_identities` — Phase 2 auth model (`UserIdentity`).

Module 12 does **not** add a separate `customers` collection.

## Profile fields (Phase 4)

| Field | Type | PATCH | Notes |
|-------|------|-------|-------|
| `_id` | ObjectId | no | Exposed as `customerId` |
| `phone` | string | no | Read-only in profile API |
| `name` | string \| null | yes | 1–100 chars when set |
| `email` | string \| null | yes | Lowercase trim; valid email when set |
| `role` | enum | no | Must be `customer` for profile routes |
| `accountStatus` | enum | no | Must be active for access |
| `cityId` | ObjectId \| null | no | Optional read in future; not in Phase 4 PATCH |

## Indexes

Existing Phase 2 indexes on `user_identities` (`phone` + `role`, `email` sparse).

## API

`docs/contracts/customer-profile-api.md`
