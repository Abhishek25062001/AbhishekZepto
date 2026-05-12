# API Standards

## Base Route

All backend APIs use:

```text
/api/v1
```

Current route groups:

```text
/api/v1/public
/api/v1/customer
/api/v1/delivery
/api/v1/vendor
/api/v1/admin
/api/v1/internal
```

Planned route group:

```text
/api/v1/webhooks
```

## Current Verified Backend Endpoints

Implemented:

```text
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
POST /api/v1/internal/system/database-write-check
POST /api/v1/public/auth/request-otp
POST /api/v1/public/auth/verify-otp
POST /api/v1/public/auth/refresh-token
POST /api/v1/public/auth/logout
GET /api/v1/internal/auth/test-protected
```

Placeholder surface endpoints currently exist for customer, delivery, vendor, admin, and internal route groups. Feature-specific routes must be added only by their owning modules.

The internal database write-check endpoint is temporary Database Foundation verification plumbing. Authentication protection is deferred to Authentication Foundation.

The public auth endpoints are Phase 1 placeholders. Real OTP, JWT signing,
refresh token rotation, and logout/session revocation behavior are deferred.

The internal auth test endpoint is temporary Authentication Foundation
verification plumbing.

The placeholder surface endpoints are only route-group readiness checks. They are not business APIs and should be replaced or extended by the owning future modules.

## Route Naming

Use lowercase kebab-case path segments.

Use nouns for resources. Use action path segments only for explicit business transitions.

Examples:

```text
GET /api/v1/customer/orders/:orderId
PATCH /api/v1/vendor/orders/:orderId/picking-status
POST /api/v1/admin/finance/refunds/:refundId/approve
POST /api/v1/webhooks/payments/razorpay
```

## Success Response

Use:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {}
}
```

## Error Response

Use:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  },
  "meta": {}
}
```

Never expose secrets, tokens, OTPs, raw payment signatures, stack traces, or internal provider credentials in API responses.

## Validation

Every endpoint accepting input must validate:

- body
- query
- params
- headers when relevant

Current backend uses Zod through `validateRequest()`. Validation failures return HTTP `422` with `VALIDATION_ERROR`.

## Authentication And Permissions

Protected endpoints must enforce:

- authentication
- role or permission checks
- scope checks for customer, delivery agent, vendor, store, city, admin, or internal usage

Frontend visibility is not security. Backend middleware is the final authority.

Authentication and permission middleware do not exist yet. Until they are implemented, do not create protected business endpoints unless the same ticket creates the minimum required auth/permission dependency or the ticket is explicitly a public endpoint.

## Pagination

List endpoints that can grow must support:

```text
page
limit
sortBy
sortOrder
```

Pagination metadata belongs in `meta.pagination`.

Current defaults:

- `page`: `1`
- `limit`: `20`
- max `limit`: `100`

## Idempotency

Critical mutating operations should support idempotency when duplicate execution can cause harm:

- order creation
- payment creation
- refund processing
- settlement generation
- delivery completion

Exact implementation is deferred to the owning modules.
