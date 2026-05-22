# Customer App Location UI Contract

Status: **PLANNED** — Module 1 implementation.

## Screens

| Screen | Route | Purpose |
|--------|-------|---------|
| LocationGate | `LocationGate` | Redirect if no `selectedStoreId` |
| AddressList | `AddressList` | List, default badge, navigate to form |
| AddressForm | `AddressForm` | Create / edit address |
| Serviceability | inline or `Serviceability` | Confirm store after address |

## API Client (`modules/addresses/api/customer-address.api.ts`)

| Function | HTTP |
|----------|------|
| `fetchAddresses` | GET `/api/v1/customer/addresses` |
| `createAddress` | POST `/api/v1/customer/addresses` |
| `updateAddress` | PATCH `/api/v1/customer/addresses/:addressId` |
| `deleteAddress` | DELETE `/api/v1/customer/addresses/:addressId` |
| `setDefaultAddress` | POST `.../set-default` |
| `checkServiceability` | POST `/api/v1/customer/serviceability` |
| `selectStore` | POST `/api/v1/customer/store-selection` |

## Location Store

| Field | Type |
|-------|------|
| `selectedAddressId` | string \| null |
| `selectedStoreId` | string \| null |
| `cityId` | string \| null |
| `storeName` | string \| null |

## UX Rules

- Block catalog until `selectedStoreId` set (LocationGate).
- Hide `ServiceabilityPlaceholderBanner` when store selected.
- Home header shows address label + store name.
- Unserviceable: full-screen message + change address CTA.

## Permissions

Customer JWT only; no extra permission codes (Phase 4 MVP).
