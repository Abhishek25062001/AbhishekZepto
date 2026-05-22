# Customer Profile API Contract

Status: **IMPLEMENTED** — Module 12 (2026-05-19).

Architecture: `docs/architecture/basic-customer-profile.md`  
Verification: `docs/testing/basic-customer-profile-verification.md`

Authentication: `authenticate` + `CUSTOMER` role.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/customer/profile` | Read authenticated customer profile |
| PATCH | `/api/v1/customer/profile` | Update `name` and/or `email` |

## GET `/api/v1/customer/profile`

**Success (200):**

```json
{
  "customerId": "65f0a0000000000000000001",
  "phone": "9999999999",
  "name": "Demo Customer",
  "email": "customer@example.com"
}
```

| Field | Notes |
|-------|-------|
| `customerId` | User identity id |
| `phone` | Read-only |
| `name` | Nullable |
| `email` | Nullable |

**Failures:**

| Code | HTTP | When |
|------|------|------|
| `USER_NOT_FOUND` | 404 | Identity missing or not customer |

## PATCH `/api/v1/customer/profile`

**Body (partial):**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `name` | no | 1–100 chars, or `null` to clear |
| `email` | no | Valid email, or `null` to clear |

At least one of `name` or `email` must be present in the body.

**Success (200):** Same shape as GET response with updated values.

**Failures:**

| Code | HTTP | When |
|------|------|------|
| `PROFILE_VALIDATION_FAILED` | 422 | Invalid name/email |
| `USER_NOT_FOUND` | 404 | Identity missing |

## DB

`docs/database/customer-profile-schema.md` — maps to `user_identities`.
