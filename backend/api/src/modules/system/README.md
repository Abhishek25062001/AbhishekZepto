# System Module

## Public System Endpoint Ownership

The system module owns public backend connectivity and runtime information endpoints.

Owned public endpoints:

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`

## Frontend Usage

System APIs are used by all frontend surfaces for connectivity checks:

- Customer App
- Delivery Agent App
- Vendor Panel
- Admin Dashboard

## Boundary

These endpoints expose safe runtime status only. They must not expose secrets, credentials, raw environment files, database connection strings, or internal provider configuration.
