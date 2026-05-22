# Customer Location & Store Selection Verification

## Backend

- [x] Unit/route tests — `npm run test:customer-addresses -w backend/api`
- [ ] `GET /api/v1/customer/addresses` — empty then populated after seed (live)
- [ ] `POST /api/v1/customer/addresses` — creates with lat/long (live)
- [ ] `PATCH /api/v1/customer/addresses/:id` — updates fields (live)
- [ ] `DELETE /api/v1/customer/addresses/:id` — soft delete (live)
- [ ] `POST .../set-default` — only one default (live)
- [ ] `POST /api/v1/customer/serviceability` — returns store near seed store (live)
- [ ] `POST /api/v1/customer/serviceability` — unserviceable coords → 422 (live)
- [ ] `POST /api/v1/customer/store-selection` — persists selection (live)
- [ ] 401 without customer JWT (live)

## Customer App

- [x] Typecheck — `npm run typecheck -w apps/customer-app`
- [ ] After login without store → address flow (device)
- [ ] Add address → serviceability → catalog accessible (device)
- [ ] Home shows store context (device)
- [x] Serviceability banner shows store name when store set (code)

## Seed

- [ ] `npm run seed` creates address for `9999999999` near `STORE-000001` (live MongoDB)

## Dev Login

- Phone: `6666666666` (admin) — N/A
- Customer: `9999999999`, OTP `123456`
