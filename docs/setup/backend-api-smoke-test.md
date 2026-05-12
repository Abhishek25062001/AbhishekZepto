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

## Security API Endpoints

- `GET /api/v1/public/health`
- `POST /api/v1/public/auth/request-otp`
- `GET /api/v1/internal/auth/test-protected`

## Security DB Fields

Audit logs may be created for access denied events.
