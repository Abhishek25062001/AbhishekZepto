# Phase 4 Module 1 — Customer Location & Store Selection — Complete

**Date:** 2026-05-19

## Summary

Module 1 delivers customer address CRUD, haversine-based store serviceability, persisted store selection, customer-app location flow, and dev seed data for customer `9999999999`.

## API (IMPLEMENTED)

- `GET|POST|PATCH|DELETE /api/v1/customer/addresses`
- `POST /api/v1/customer/addresses/:addressId/set-default`
- `POST /api/v1/customer/serviceability`
- `POST /api/v1/customer/store-selection`

## Collections

- `customer_addresses`
- `customer_store_selections`

## Tests

```bash
npm run test:customer-addresses -w backend/api
npm run typecheck -w apps/customer-app
```

## Known Limitations

- No map SDK / geocoding; lat/long entered manually in app MVP
- Live curl/E2E not run in CI for this module closeout

## Next

**Module 2 — Customer Home & Shopping Entry**
