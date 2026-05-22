# Phase 4 Module 2 — Customer Home & Shopping Entry — Complete

**Date:** 2026-05-19

## Summary

Module 2 delivers aggregated `GET /api/v1/customer/home` and `CustomerHomeScreen` as the shopping-entry experience after store selection.

## API (IMPLEMENTED)

- `GET /api/v1/customer/home` — query: `storeId` (required), `cityId?`, `categoryLimit?`, `featuredLimit?`

## Response sections

- `store`, `serviceability`, `categories`, `featuredProducts`, `banners: []`

## Backend module

`backend/api/src/modules/home/` — composes Phase 3 catalog-search services; no new MongoDB collection.

## Customer app

- `apps/customer-app/src/modules/home/` — API, hook, components, `CustomerHomeScreen`
- `Main` → `Home` uses shopping entry; `DevHome` for dev diagnostics
- `CatalogHomeScreen` remains deep browse entry

## Tests

```bash
npm run test:customer-home -w backend/api
npm run typecheck -w apps/customer-app
```

## Known limitations

- Empty `banners` until campaigns module
- No add-to-cart on home (Module 4)
- Live curl/device E2E not run in closeout

## Next

**Module 3 — Cart Backend Foundation**
