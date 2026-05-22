# Customer Home & Shopping Entry Verification

## Backend

- [x] Unit/route tests — `npm run test:customer-home -w backend/api`
- [ ] `GET /api/v1/customer/home?storeId=` — returns all sections for seed store (live)
- [ ] Missing `storeId` → validation error
- [ ] Invalid `storeId` → `STORE_NOT_FOUND`
- [ ] Closed store → `serviceability.isServiceable: false`
- [ ] `storeId` not matching customer selection → 403/422 (if enforced)
- [ ] 401 without customer JWT
- [ ] Unit tests: `npm run test:customer-home -w backend/api`

## Customer App

- [x] Typecheck — `npm run typecheck -w apps/customer-app`
- [ ] After store selected → `CustomerHomeScreen` loads feed (device)
- [ ] Category tap → `CategoryProducts`
- [ ] Product tap → `ProductDetail`
- [ ] "Browse all" → `CatalogHome`
- [ ] Change location → Addresses stack
- [ ] Typecheck: `npm run typecheck -w apps/customer-app`

## Seed / Dev Login

- Customer: `9999999999`, OTP `123456`
- Use `storeId` from seed selection / `STORE-000001`
