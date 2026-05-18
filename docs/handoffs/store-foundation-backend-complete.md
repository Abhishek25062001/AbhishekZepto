# Store Foundation Backend — Complete

Date: 2026-05-18

## Scope delivered

Admin CRUD for cities, service areas, and stores:

- `GET|POST /api/v1/admin/locations/cities`
- `GET|PATCH|DELETE /api/v1/admin/locations/cities/:cityId`
- `GET|POST /api/v1/admin/locations/service-areas`
- `GET|PATCH|DELETE /api/v1/admin/locations/service-areas/:serviceAreaId`
- `GET|POST /api/v1/admin/stores`
- `GET|PATCH|DELETE /api/v1/admin/stores/:storeId`

Collections: `cities`, `service_areas`, `stores`  
Permissions: `locations:read|create|update|delete`, `stores:read|create|update|delete`  
Tests: `npm run test:store-foundation`  
Seeds: Delhi city, Dwarka service area, `STORE-000001` store (`npm run seed:dry`)

## Cross-module notes

- `vendorId` validated as ObjectId only (no vendors master CRUD).
- Store delete active-order check stubbed until Order Management.

## Not in scope

- Store Product Mapping, Inventory, Media, frontend UIs, Orders runtime

## Verification

```bash
cd backend/api
npm run typecheck
npm run lint
npm run test:store-foundation
npm run test:seed-matrix
npm run seed:dry
```
