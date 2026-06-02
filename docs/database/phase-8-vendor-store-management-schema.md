# Phase 8 Module 6 — Vendor & Store Management Schema

## Status

Foundation documented.

## Existing Collections Used

Module 6 uses existing collections only:

- `stores`
- `user_identities`
- `orders`
- `inventory_stocks`
- `admin_action_audits`

No new vendor/store collection is introduced by the foundation ticket.

## Store Fields

The admin store management read model may use existing `stores` fields:

| Field | Source | Notes |
| --- | --- | --- |
| `storeId` | `_id` | Store identifier. |
| `vendorId` | `vendorId` | Vendor tenant identifier. |
| `cityId` | `cityId` | City scope. |
| `serviceAreaIds` | `serviceAreaIds` | Service areas assigned to the store. |
| `name` | `name` | Store display name. |
| `slug` | `slug` | Unique per city for active stores. |
| `code` | `code` | Store code. |
| `description` | `description` | Optional store description. |
| `phone` | `phone` | Store contact phone. |
| `email` | `email` | Optional store contact email. |
| `addressLine1` | `addressLine1` | Store address. |
| `addressLine2` | `addressLine2` | Optional address continuation. |
| `landmark` | `landmark` | Optional landmark. |
| `pincode` | `pincode` | Postal code. |
| `latitude` | `latitude` | Store latitude. |
| `longitude` | `longitude` | Store longitude. |
| `serviceRadiusKm` | `serviceRadiusKm` | Service radius. |
| `openingTime` | `openingTime` | Store opening time. |
| `closingTime` | `closingTime` | Store closing time. |
| `operatingDays` | `operatingDays` | Operating day keys. |
| `isOpen` | `isOpen` | Operational open flag. |
| `isAcceptingOrders` | `isAcceptingOrders` | Order acceptance flag. |
| `temporaryClosureReason` | `temporaryClosureReason` | Existing closure reason. |
| `storeType` | `storeType` | Existing store type enum. |
| `fulfillmentType` | `fulfillmentType` | Existing fulfillment type enum. |
| `status` | `status` | Existing store status enum. |
| `createdAt` | `createdAt` | Base timestamp. |
| `updatedAt` | `updatedAt` | Base timestamp. |

## Vendor Identity Fields

Module 6 treats vendor management as admin inspection and control of existing
vendor-scoped identities in `user_identities`. The read model may use:

| Field | Source | Notes |
| --- | --- | --- |
| `vendorUserId` | `_id` | Vendor-facing user identity id. |
| `vendorId` | `vendorId` | Vendor tenant identifier. |
| `storeId` | `storeId` | Store scope when present. |
| `cityId` | `cityId` | City scope when present. |
| `name` | `name` | Identity name. |
| `phone` | `phone` | Identity phone. |
| `email` | `email` | Identity email. |
| `role` | `role` | `vendor_owner`, `store_manager`, or `store_staff`. |
| `accountStatus` | `accountStatus` | Existing auth account status. |
| `lastLoginAt` | `lastLoginAt` | Last login timestamp. |
| `createdAt` | `createdAt` | Base timestamp. |
| `updatedAt` | `updatedAt` | Base timestamp. |

## Boundary

Module 6 must not add payout, settlement, export, analytics, catalog rewrite,
inventory mutation, order workflow, or frontend fields.
