# Basic Customer Profile

## Module

Phase 4 Module 12 — Basic Customer Profile.

## Goal

Expose customer profile read/update APIs and a customer-app profile screen for `name` and `email`. Phone is read-only from `user_identities`.

## Prerequisites

- Phase 2: Customer auth (`user_identities`, JWT).
- Phase 4 Module 1: Address management (profile links to addresses).
- Phase 4 Module 11: My orders link on profile screen.

## API

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/customer/profile` | Read own profile |
| PATCH | `/api/v1/customer/profile` | Update `name` and/or `email` |

## Persistence

Collection: `user_identities` (Phase 2 auth model).  
Writable fields: `name`, `email`.  
Read-only in API: `phone`, `customerId`.

## Customer app

| Route | Screen |
|-------|--------|
| `Profile` | `CustomerProfileScreen` — form + links |

Links: **My orders**, **Manage addresses**, **Manage sessions**, **Logout**.

## Module boundaries

| In scope | Out of scope |
|----------|----------------|
| GET/PATCH profile | Phone change |
| Profile form UI | Profile image upload |
| Address/orders links | Admin profile APIs |

## QA

- Customer `9999999999`, OTP `123456`
- PATCH name/email; reload profile

## Contracts

- `docs/contracts/customer-profile-api.md`
- `docs/contracts/customer-app-profile-ui-contract.md`
