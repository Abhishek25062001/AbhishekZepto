# Access Control Test Matrix

## Goal

Define the expected allow and deny outcomes for Phase 2 access-control checks.

## Seeded Users

- Customer: `9999999999`
- Admin: `6666666666`
- Vendor: `7777777777`
- Delivery agent: `8888888888`

## Matrix

| Surface | Seeded role | Endpoint / action | Expected result |
| --- | --- | --- | --- |
| Customer App | `customer` | `GET /api/v1/customer/me/permissions` | allow |
| Customer App | `customer` | `GET /api/v1/internal/auth/test-protected` | deny |
| Delivery Agent App | `delivery_agent` | `GET /api/v1/delivery/me/permissions` | allow |
| Delivery Agent App | `delivery_agent` | `GET /api/v1/internal/auth/test-protected` | deny |
| Vendor Panel | `vendor_owner` | `GET /api/v1/vendor/me/permissions` | allow |
| Vendor Panel | `vendor_owner` | `GET /api/v1/internal/auth/test-vendor-scope` with owned `vendorId` | allow |
| Vendor Panel | `vendor_owner` | `GET /api/v1/internal/auth/test-store-scope` with owned `storeId` | allow |
| Vendor Panel | `vendor_owner` | `GET /api/v1/internal/auth/test-vendor-scope` with foreign `vendorId` | deny |
| Admin Dashboard | `super_admin` | `GET /api/v1/admin/me/permissions` | allow |
| Admin Dashboard | `super_admin` | `GET /api/v1/internal/auth/test-protected` | allow |
| Admin Dashboard | `super_admin` | `GET /api/v1/internal/auth/test-store-scope` without store scope | deny |
| Any authenticated surface | matching seeded role | `GET /api/v1/auth/me/sessions` | allow |
| Any authenticated surface | matching seeded role | `POST /api/v1/auth/logout-other-sessions` | allow |
| Any authenticated surface | matching seeded role | `POST /api/v1/auth/logout-session` with current session id | deny |

## Expected Deny Codes

- `UNAUTHORIZED`
- `FORBIDDEN`
- `SESSION_REVOKED`
- `SESSION_EXPIRED`
- `VENDOR_SCOPE_REQUIRED`
- `STORE_SCOPE_REQUIRED`
- `CITY_SCOPE_REQUIRED`
- `VENDOR_SCOPE_MISMATCH`
- `STORE_SCOPE_MISMATCH`
- `CITY_SCOPE_MISMATCH`
- `SESSION_NOT_FOUND`
- `SESSION_ACCESS_DENIED`
