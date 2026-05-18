# Store Foundation Validation Rules

Status: **IMPLEMENTED** in city, service area, and store validators.

## City

| Field | Rule |
|-------|------|
| `name` | required |
| `slug` | optional; auto-generated |
| `state`, `country`, `timezone`, `currencyCode` | required on create |
| `serviceRadiusKm` | optional; > 0 when provided |

## Service area

| Field | Rule |
|-------|------|
| `cityId` | required on create |
| `name` | required |
| `radiusKm` | optional; > 0 when provided |

## Store

| Field | Rule |
|-------|------|
| `vendorId`, `cityId`, `name`, `phone`, `addressLine1`, `pincode` | required on create |
| `latitude`, `longitude`, `serviceRadiusKm`, `openingTime`, `closingTime`, `operatingDays` | required on create |
| `storeType`, `fulfillmentType` | required enum on create |
| `code` | optional on create; not accepted on update |
| `temporaryClosureReason` | required when `isOpen` or `isAcceptingOrders` set to `false` on update |
