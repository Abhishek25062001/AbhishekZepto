# Backend API Smoke Test

## Purpose

This document records manual smoke-test commands for Backend Core Foundation.

These commands verify the public backend core endpoints and the unknown-route
error response.

## Prerequisites

The backend dev server must be running on:

```text
http://localhost:5000
```

Required runtime environment values:

```text
APP_ENV=development
APP_PORT=5000
APP_VERSION=1.0.0
DB_MONGO_URI=mongodb://localhost:27017/zepto_like_dev
```

## Health Endpoint

```bash
curl http://localhost:5000/api/v1/public/health
```

Expected response shape:

```json
{
  "success": true,
  "message": "Backend is healthy",
  "data": {
      "status": "ok",
      "service": "backend-api",
      "database": {
        "status": "connected",
        "readyState": 1
      }
    },
    "meta": {}
  }
```

The `database.status` value reflects the current Mongoose connection state:

- `connected`
- `disconnected`
- `connecting`
- `disconnecting`

Run the same health check after starting MongoDB to verify database connectivity:

```bash
curl http://localhost:5000/api/v1/public/health
```

## Version Endpoint

```bash
curl http://localhost:5000/api/v1/public/version
```

Expected response shape:

```json
{
  "success": true,
  "message": "Version fetched successfully",
  "data": {
    "version": "1.0.0",
    "environment": "development"
  },
  "meta": {}
}
```

## System Info Endpoint

```bash
curl http://localhost:5000/api/v1/public/system-info
```

Expected response shape:

```json
{
  "success": true,
  "message": "System info fetched successfully",
  "data": {
    "environment": "development",
    "uptime": 0,
    "timestamp": "ISO_DATE_STRING"
  },
  "meta": {}
}
```

## Unknown Route

```bash
curl http://localhost:5000/api/v1/public/unknown
```

Expected status code:

```text
404
```

Expected response shape:

```json
{
  "success": false,
  "message": "Route not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {}
  },
  "meta": {}
}
```

## Temporary Database Write Check

Database Foundation adds this temporary internal verification endpoint:

```bash
curl -X POST http://localhost:5000/api/v1/internal/system/database-write-check
```

Expected response shape:

```json
{
  "success": true,
  "message": "Database write check completed",
  "data": {
    "key": "database_connection_test",
    "value": "ok"
  },
  "meta": {}
}
```

This endpoint creates or updates a `system_checks` document for connection
verification. Authentication protection for this internal endpoint is deferred
to Authentication Foundation.

## Temporary Protected Auth Test

Authentication Foundation adds this temporary internal verification endpoint. In
Backend Auth Core, this curl should be exercised with a real access token from
the OTP verification flow:

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN"
```

Expected response shape:

```json
{
  "success": true,
  "message": "Protected auth test route working",
  "data": {
    "user": {}
  },
  "meta": {}
}
```

`GET /api/v1/internal/auth/test-protected` remains a temporary auth verification
route and in Backend Auth Core should run through real `authenticate()` and
`requirePermission('auth:read')` checks.

## Customer Permissions Endpoint

Customer App Authentication uses this authenticated customer endpoint:

```bash
curl http://localhost:5000/api/v1/customer/me/permissions \
  -H "Authorization: Bearer REPLACE_CUSTOMER_ACCESS_TOKEN"
```

Expected response shape:

```json
{
  "success": true,
  "message": "Customer permissions fetched successfully",
  "data": {
    "userId": "CUSTOMER_USER_ID",
    "customerId": "CUSTOMER_USER_ID",
    "deliveryAgentId": null,
    "role": "customer",
    "permissions": ["customer:read_self"],
    "vendorId": null,
    "storeId": null,
    "cityId": "CITY_ID_OR_NULL"
  },
  "meta": {}
}
```

## Delivery Permissions Endpoint

Delivery Agent App Authentication uses this authenticated delivery endpoint:

```bash
curl http://localhost:5000/api/v1/delivery/me/permissions \
  -H "Authorization: Bearer REPLACE_DELIVERY_ACCESS_TOKEN"
```

Expected response shape:

```json
{
  "success": true,
  "message": "Delivery permissions fetched successfully",
  "data": {
    "userId": "DELIVERY_USER_ID",
    "customerId": null,
    "deliveryAgentId": "DELIVERY_USER_ID",
    "role": "delivery_agent",
    "permissions": ["delivery:read_self"],
    "vendorId": null,
    "storeId": null,
    "cityId": "CITY_ID_OR_NULL"
  },
  "meta": {}
}
```

## Vendor Permissions Endpoint

Vendor Panel Authentication uses this authenticated vendor endpoint:

```bash
curl http://localhost:5000/api/v1/vendor/me/permissions \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected response shape:

```json
{
  "success": true,
  "message": "Vendor permissions fetched successfully",
  "data": {
    "userId": "VENDOR_USER_ID",
    "vendorUserId": "VENDOR_USER_ID",
    "role": "vendor_owner",
    "permissions": ["vendor:read_store"],
    "vendorId": "VENDOR_ID",
    "storeId": "STORE_ID",
    "cityId": "CITY_ID_OR_NULL"
  },
  "meta": {}
}
```

## Admin Permissions Endpoint

Admin Dashboard Authentication uses this authenticated admin endpoint:

```bash
curl http://localhost:5000/api/v1/admin/me/permissions \
  -H "Authorization: Bearer REPLACE_ADMIN_ACCESS_TOKEN"
```

Expected response shape:

```json
{
  "success": true,
  "message": "Admin permissions fetched successfully",
  "data": {
    "userId": "ADMIN_USER_ID",
    "adminId": "ADMIN_USER_ID",
    "role": "super_admin",
    "permissions": ["*:*"],
    "vendorId": null,
    "storeId": null,
    "cityId": null
  },
  "meta": {}
}
```

## Security Headers

```bash
curl -I http://localhost:5000/api/v1/public/health
```

Expected headers include:

- `x-dns-prefetch-control`
- `x-frame-options`
- `x-content-type-options`
- `referrer-policy`

Expected header absence:

- `x-powered-by`

## CORS Preflight

Vendor Panel origin:

```bash
curl -i -X OPTIONS http://localhost:5000/api/v1/public/health \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET"
```

Admin Dashboard origin:

```bash
curl -i -X OPTIONS http://localhost:5000/api/v1/public/health \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: GET"
```

Expected response includes the matching `access-control-allow-origin` value for
the local Vendor Panel and Admin Dashboard origins.

## Auth Rate Limit Manual Check

```bash
for i in {1..7}; do curl -X POST http://localhost:5000/api/v1/public/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","role":"customer"}'; done
```

Expected result: repeated auth requests return the standard `RATE_LIMITED`
response after the threshold.

## Protected Route Without Token

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected
```

Expected status:

```text
401
```

## Role & Permission Smoke Checks

Allow case with seeded `super_admin`:

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN"
```

Expected status:

```text
200
```

Deny case with seeded `vendor_owner`:

```bash
curl http://localhost:5000/api/v1/internal/auth/test-protected \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected status:

```text
403
```

Expected deny code:

```text
FORBIDDEN
```

The deny case should also create an audit log entry with
`eventType=security.access_denied`.

## Tenant & Store Scope Smoke Checks

Vendor scope allow:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-vendor-scope?vendorId=65f0a0000000000000000001" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Store scope allow:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-store-scope?storeId=65f0a0000000000000000002" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

City scope allow:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-city-scope?cityId=65f0a0000000000000000003" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Scope mismatch deny:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-vendor-scope?vendorId=65f0a0000000000000009999" \
  -H "Authorization: Bearer REPLACE_VENDOR_ACCESS_TOKEN"
```

Expected deny code:

```text
VENDOR_SCOPE_MISMATCH
```

Missing-scope deny:

```bash
curl "http://localhost:5000/api/v1/internal/auth/test-store-scope" \
  -H "Authorization: Bearer REPLACE_SUPER_ADMIN_ACCESS_TOKEN"
```

Expected deny code:

```text
STORE_SCOPE_REQUIRED
```

Scope deny checks should write audit events with
`eventType=security.scope_access_denied`.

## Security API Endpoints

- `GET /api/v1/public/health`
- `POST /api/v1/public/auth/request-otp`
- `GET /api/v1/internal/auth/test-protected`

## Security DB Fields

Audit logs may be created for access denied events.

## Session & Device Management Smoke Checks

List current user sessions:

```bash
curl http://localhost:5000/api/v1/auth/me/sessions \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN"
```

Logout one other session:

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout-session \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"REPLACE_OTHER_SESSION_ID"}'
```

Logout all other sessions:

```bash
curl -X POST http://localhost:5000/api/v1/auth/logout-other-sessions \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Internal session list verification:

```bash
curl http://localhost:5000/api/v1/internal/auth/test-session-list \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN"
```

Internal session revoke verification:

```bash
curl -X POST http://localhost:5000/api/v1/internal/auth/test-session-revoke \
  -H "Authorization: Bearer REPLACE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"REPLACE_OTHER_SESSION_ID"}'
```

## Phase 2 Access Control Coverage

Use these companion docs for the full manual pass:

- `docs/testing/access-control-backend-happy-path.md`
- `docs/testing/access-control-backend-deny-path.md`
- `docs/testing/access-control-audit-verification.md`
