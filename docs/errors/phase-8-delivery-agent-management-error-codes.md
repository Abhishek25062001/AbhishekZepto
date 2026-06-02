# Phase 8 Module 5 — Delivery Agent Management Errors

## Error Codes

| Code | HTTP status | Meaning |
| --- | --- | --- |
| `DELIVERY_AGENT_NOT_FOUND` | `404` | The requested delivery agent does not exist or is deleted. |
| `INVALID_ADMIN_SCOPE` | `403` | The requested delivery agent or city filter is outside the authenticated admin city scope. |
| `VALIDATION_ERROR` | `400` | Request params, query, or body failed validation. |
| `UNAUTHORIZED` | `401` | Admin authentication is missing or invalid. |
| `FORBIDDEN` | `403` | Authenticated admin lacks the required permission for the route. |

## Validation Contract

- `deliveryAgentId` and `cityId` must be Mongo ObjectIds.
- List pagination uses `page >= 1` and `1 <= limit <= 100`.
- Delivery-agent list filters are limited to status, availability status,
  verification status, city, search, page, and limit.
- Assignment inspection filters are limited to delivery status, date range,
  page, and limit.
- Status and verification updates require a reason between 5 and 500
  characters.

## Scope Boundary

When the authenticated admin context includes `cityId`, Module 5 constrains
list, detail, status, verification, assignment inspection, and audit inspection
to that city. Module 5 does not add cross-city override endpoints.
