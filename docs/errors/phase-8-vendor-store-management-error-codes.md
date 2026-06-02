# Phase 8 Module 6 — Vendor & Store Management Errors

## Error Codes

| Code | HTTP status | Meaning |
| --- | --- | --- |
| `NOT_FOUND` | `404` | The requested vendor tenant has no active vendor-scoped identities. |
| `STORE_NOT_FOUND` | `404` | The requested store does not exist or is deleted. |
| `INVALID_ADMIN_SCOPE` | `403` | The requested vendor, store, or city filter is outside the authenticated admin city scope. |
| `VALIDATION_ERROR` | `400` | Request params, query, or body failed validation. |
| `UNAUTHORIZED` | `401` | Admin authentication is missing or invalid. |
| `FORBIDDEN` | `403` | Authenticated admin lacks the required permission for the route. |

## Validation Contract

- `vendorId`, `storeId`, and `cityId` must be Mongo ObjectIds.
- List pagination uses `page >= 1` and `1 <= limit <= 100`.
- Vendor list filters are limited to status, city, search, page, and limit.
- Store list filters are limited to status, vendor, city, search, page, and
  limit.
- Store inspection endpoints support only page and limit.
- Vendor and store status updates require a reason between 5 and 500
  characters.

## Scope Boundary

When the authenticated admin context includes `cityId`, Module 6 constrains
list, detail, status, and inspection endpoints to that city. Module 6 does not
add cross-city override endpoints.
