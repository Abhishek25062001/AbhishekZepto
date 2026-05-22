# Customer App Profile UI Contract

Status: **IMPLEMENTED** — Module 12 (2026-05-19).

## Screen

| Screen | Route | Purpose |
|--------|-------|---------|
| CustomerProfile | `Profile` | View/edit name and email; account links |

## API Client (`modules/profile/api/customer-profile.api.ts`)

| Function | HTTP |
|----------|------|
| `getCustomerProfile` | GET `/api/v1/customer/profile` |
| `updateCustomerProfile` | PATCH `/api/v1/customer/profile` |

## Hooks

| Hook | Purpose |
|------|---------|
| `useCustomerProfile` | Query profile |
| `useUpdateCustomerProfile` | Mutation PATCH |

## Components

| Component | Purpose |
|-----------|---------|
| `ProfilePhoneField` | Read-only phone |
| `ProfileForm` | Name, email, save |
| `ProfileErrorState` | Error + retry |

## Navigation links

| Action | Target |
|--------|--------|
| My orders | `OrderHistory` |
| Manage addresses | `Addresses` → `AddressList` |
| Manage sessions | `Sessions` |
| Logout | `logoutCustomer` |

## Error UX

| Code | Message |
|------|---------|
| `PROFILE_VALIDATION_FAILED` | Invalid name or email |
| `USER_NOT_FOUND` | Profile not found |

## Related

- `docs/contracts/customer-profile-api.md`
- `docs/contracts/customer-app-order-ui-contract.md`
