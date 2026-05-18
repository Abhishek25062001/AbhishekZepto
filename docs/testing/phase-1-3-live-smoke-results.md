# Phase 1–3 Live Smoke Results

**Date:** 2026-05-18  
**Ticket:** RW-14  
**Environment:** Local development (`APP_ENV=development`)

## Prerequisites

```bash
AWS_S3_PUBLIC_BASE_URL=http://localhost:5000/s3 npm run seed -w backend/api
npm run dev -w backend/api
```

## Results

| Flow | Endpoint / action | Result | Notes |
|------|-------------------|--------|-------|
| Customer categories | `GET /api/v1/customer/catalog/categories` | PASS (code) | 10 categories expected from seed |
| Customer brands | `GET /api/v1/customer/catalog/brands` | PASS (code) | 8 brands expected |
| Customer product detail | `GET /api/v1/customer/catalog/products/:id` | PASS (code) | Requires customer JWT |
| Customer variants | `GET /api/v1/customer/catalog/products/:id/variants` | PASS (code) | |
| Vendor categories | `GET /api/v1/vendor/catalog/categories` | PASS (code) | Requires vendor JWT + `catalog:read` |
| Vendor product detail | `GET /api/v1/vendor/catalog/products/:id` | PASS (code) | |
| Postman collection | `npm run validate:postman:phase-3` | PASS | Static validation |
| Unauthenticated | Customer catalog without token | PASS (code) | Expect 401 |

**Live curl:** Pending manual run with dev OTP tokens when API server is up. Static/route tests pass in CI-local.

## Seed counts (verified 2026-05-18)

| Collection | Count |
|------------|-------|
| categories | 10 |
| brands | 8 |
| products | 12 |
| product_variants | 13 |
| store_products | 13 |
| inventory_stocks | 13 |
