# Store Management API

Status: **IMPLEMENTED**

Base path: `/api/v1/admin/stores`

## Endpoints

| Method | Path | Permission |
|--------|------|------------|
| GET | `/` | `stores:read` |
| POST | `/` | `stores:create` |
| GET | `/:storeId` | `stores:read` |
| PATCH | `/:storeId` | `stores:update` |
| DELETE | `/:storeId` | `stores:delete` |

## Request body (create / update)

| Field | Type | Notes |
|-------|------|-------|
| `vendorId` | ObjectId string | Required on create; validated only |
| `cityId` | ObjectId string | Required on create |
| `serviceAreaIds` | ObjectId[] | Optional; must belong to city |
| `name` | string | Required on create |
| `slug` | string | Optional; unique per city |
| `code` | string | Optional on create; auto-generated; immutable on update |
| `description` | string \| null | Optional |
| `phone` | string | Required on create |
| `email` | string \| null | Optional |
| `addressLine1` | string | Required on create |
| `addressLine2` | string \| null | Optional |
| `landmark` | string \| null | Optional |
| `pincode` | string | Required on create |
| `latitude` | number | Required on create |
| `longitude` | number | Required on create |
| `serviceRadiusKm` | number | Required on create |
| `openingTime` | string | Required on create |
| `closingTime` | string | Required on create |
| `operatingDays` | string[] | Required on create |
| `isOpen` | boolean | Optional; closure reason required when false |
| `isAcceptingOrders` | boolean | Optional; closure reason required when false |
| `temporaryClosureReason` | string \| null | Required when closing store |
| `storeType` | enum | `grocery`, `pharmacy`, `restaurant`, `general`, `dark_store` |
| `fulfillmentType` | enum | `delivery`, `pickup`, `delivery_and_pickup` |
| `status` | enum | `active`, `inactive`, `suspended`, `archived` |

## List query

`page`, `limit`, `vendorId`, `cityId`, `serviceAreaId`, `status`, `isOpen`, `isAcceptingOrders`, `storeType`, `fulfillmentType`, `search`, `sortBy`, `sortOrder`

## DB fields

`stores.vendorId`, `stores.cityId`, `stores.serviceAreaIds`, address/geo/ops fields, `stores.storeType`, `stores.fulfillmentType`, `stores.isOpen`, `stores.isAcceptingOrders`, `stores.temporaryClosureReason`, `stores.status`, soft-delete and audit fields.

## Delete guard

`STORE_HAS_ACTIVE_ORDERS` is stubbed (returns 0) until Order Management module ships.
