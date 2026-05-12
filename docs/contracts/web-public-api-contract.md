# Web Public API Contract

## Purpose

This document records the public backend API endpoints used by the Web Panels
Foundation module.

The Vendor Panel and Admin Dashboard must call these endpoints through
`src/services/api/public.api.ts`.

## Response Envelope

Successful responses use:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {}
}
```

Error responses use:

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

## Public Endpoints

```http
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
```

## Health Endpoint

```http
GET /api/v1/public/health
```

Expected data shape:

```json
{
  "status": "ok",
  "service": "backend-api",
  "database": {
    "status": "connected",
    "readyState": 1
  }
}
```

## Version Endpoint

```http
GET /api/v1/public/version
```

Expected data shape:

```json
{
  "version": "1.0.0",
  "environment": "development"
}
```

## System Info Endpoint

```http
GET /api/v1/public/system-info
```

Expected data shape:

```json
{
  "environment": "development",
  "uptime": 0,
  "timestamp": "2026-05-10T00:00:00.000Z"
}
```

## Web Usage Rule

Pages must not call Axios directly. They should use hooks or API service
functions that wrap these endpoint contracts.

