# Customer Address API Contract

Status: **IMPLEMENTED** — Module 1 (2026-05-19).

Authentication: `authenticate` + `CUSTOMER` role on all routes.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/customer/addresses` | List customer addresses |
| POST | `/api/v1/customer/addresses` | Create address |
| PATCH | `/api/v1/customer/addresses/:addressId` | Update address |
| DELETE | `/api/v1/customer/addresses/:addressId` | Soft-delete address |
| POST | `/api/v1/customer/addresses/:addressId/set-default` | Set default address |
| POST | `/api/v1/customer/serviceability` | Resolve nearest serviceable store from coordinates |
| POST | `/api/v1/customer/store-selection` | Persist selected store for customer + address |

## POST `/api/v1/customer/store-selection`

**Body:** `addressId`, `storeId`

**Success:** `{ storeId, storeName, cityId, addressId, isSelected: true }`

## POST `/api/v1/customer/serviceability`

**Body:** `latitude`, `longitude`, optional `addressId`

**Success:** `{ storeId, storeName, cityId, estimatedMinutes? }`

**Unserviceable:** HTTP 404 or 422 with `SERVICEABILITY_AREA_UNAVAILABLE` (see error codes).

## POST `/api/v1/customer/addresses`

**Body:** `label`, `line1`, `line2?`, `landmark?`, `city`, `cityId?`, `state?`, `postalCode?`, `latitude`, `longitude`, `isDefault?`

## Standard Envelope

Success/error per `project-context/API_STANDARDS.md`.

## DB Fields

`docs/database/customer-address-schema.md`

## Error Codes

`docs/errors/phase-4-error-codes.md` — `ADDRESS_*`, `SERVICEABILITY_*`
