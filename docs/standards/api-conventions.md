# API Conventions

## Purpose

This document defines common API standards for future backend modules.

It does not create API routes. It only records the route style, response style,
error style, pagination style, authentication header convention, and validation
expectations for later implementation tickets.

## API Versioning

All backend API routes should be versioned under:

```text
/api/v1
```

Future breaking API changes should use a new version prefix instead of changing
existing route behavior silently.

## Route Groups

Routes should be grouped by surface and access type:

```text
/api/v1/public
/api/v1/customer
/api/v1/delivery
/api/v1/vendor
/api/v1/admin
/api/v1/internal
/api/v1/webhooks
```

Group ownership:

- `public`: unauthenticated APIs such as health, version, public auth, and
  provider callbacks when explicitly public
- `customer`: Customer App APIs
- `delivery`: Delivery Agent App APIs
- `vendor`: Vendor Panel APIs
- `admin`: Admin Dashboard APIs
- `internal`: backend-only operational APIs
- `webhooks`: external provider callbacks such as payment gateway webhooks

## Route Naming

Route path segments should use lowercase kebab-case.

Preferred examples:

```text
GET /api/v1/customer/cart
POST /api/v1/customer/checkout
GET /api/v1/customer/orders/:orderId
GET /api/v1/vendor/orders
PATCH /api/v1/vendor/orders/:orderId/picking-status
GET /api/v1/admin/catalog/products
POST /api/v1/admin/finance/refunds/:refundId/approve
POST /api/v1/webhooks/payments/razorpay
```

Use nouns for resources. Use action path segments only when the action represents
a business transition that is clearer than a generic update.

## Success Response Format

Successful API responses should use:

```json
{
  "success": true,
  "message": "Human readable success message",
  "data": {},
  "meta": {}
}
```

Rules:

- `success` must be `true`.
- `message` should describe the completed operation.
- `data` should contain the response payload.
- `meta` should contain request metadata, pagination metadata, or be an empty
  object.

## Error Response Format

Failed API responses should use:

```json
{
  "success": false,
  "message": "Human readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  },
  "meta": {}
}
```

Rules:

- `success` must be `false`.
- `message` must be safe to show to a client.
- `error.code` should be stable and machine-readable.
- `error.details` should include validation or context data only when safe.
- Sensitive values such as tokens, OTPs, secrets, and raw payment signatures
  must not be returned.

## HTTP Status Conventions

Use standard HTTP status codes:

- `200 OK` for successful reads and updates
- `201 Created` for successful creation
- `202 Accepted` for accepted async operations
- `204 No Content` only when no response body is needed
- `400 Bad Request` for malformed requests
- `401 Unauthorized` for missing or invalid authentication
- `403 Forbidden` for insufficient permission or scope
- `404 Not Found` for missing resources
- `409 Conflict` for duplicate or invalid state conflicts
- `422 Unprocessable Entity` for validation failures
- `429 Too Many Requests` for rate limits
- `500 Internal Server Error` for unexpected server failures

## Pagination Convention

List endpoints should support pagination when result size can grow.

Preferred query parameters:

```text
page
limit
sortBy
sortOrder
```

Paginated responses should include:

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "data": [],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

## Filtering Convention

Filtering should use explicit query parameters, not loosely parsed arbitrary
objects.

Examples:

```text
status
cityId
storeId
vendorId
categoryId
brandId
searchQuery
startDate
endDate
```

Each module should document its accepted filters in its API contract.

## Authentication Header

Authenticated APIs should use the standard bearer token header:

```text
Authorization: Bearer <accessToken>
```

Refresh tokens should not be sent to normal resource endpoints. They should be
used only through the refresh-token API defined by the authentication module.

## Permission and Scope Convention

Protected APIs should enforce:

- Authentication
- Role or permission checks
- Tenant, vendor, store, city, customer, or delivery-agent scope checks when
  relevant

Frontend apps may hide UI actions based on auth response metadata, but backend
middleware remains the final authority.

## Validation Convention

Every API that accepts input should validate:

- Request body
- Route parameters
- Query parameters
- Headers when relevant

Validation failures should return `422 Unprocessable Entity` with a stable error
code and safe field-level details.

## Idempotency Convention

Critical mutating operations should support idempotency when duplicate execution
could cause harm.

Examples:

- Payment creation
- Order creation
- Refund processing
- Settlement generation
- Delivery completion

The exact idempotency implementation belongs to later backend foundation and
feature modules.

## Audit Logging Convention

Sensitive or operationally important actions should later create audit log
events.

Examples:

- Admin changes
- Vendor/store inventory changes
- Order state changes
- Payment and refund operations
- Permission denials
- Support actions

Audit event creation belongs to later implementation modules.
