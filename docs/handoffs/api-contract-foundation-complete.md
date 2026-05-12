# API Contract Foundation Handoff

## Module

Phase 1 — Foundation & Core Architecture  
Module 9 — API Contract Foundation

## Final Status

ready_for_next_module

## Tickets Completed

1. API contract format document.
2. Error code and filtering format documents.
3. OpenAPI base config.
4. OpenAPI common schemas.
5. OpenAPI public and auth paths.
6. Swagger dependencies and public docs routes.
7. System module public API refactor.
8. Shared public API types.
9. Mobile public API service contracts.
10. Web public API service contracts.
11. Frontend public API connection handoff.
12. Postman API contract collection.
13. API contract validation checklist.
14. Backend route registry.
15. API Contract Foundation verification and handoff.

## Created API Contract Documents

- `docs/contracts/api-contract-format.md`
- `docs/contracts/api-error-codes.md`
- `docs/contracts/api-filtering-format.md`
- `docs/contracts/openapi-setup.md`
- `docs/contracts/api-contract-checklist.md`
- `docs/contracts/backend-route-registry.md`
- `docs/contracts/postman/README.md`

## Created OpenAPI Files

- `backend/api/src/docs/openapi/openapi.config.ts`
- `backend/api/src/docs/openapi/common.schemas.ts`
- `backend/api/src/docs/openapi/public.paths.ts`
- `backend/api/src/docs/openapi/auth.paths.ts`
- `backend/api/src/docs/openapi/index.ts`
- `backend/api/src/routes/v1/docs.routes.ts`

## Created Postman Collection

- `docs/contracts/postman/zepto-like-phase-1.postman_collection.json`

## Connected Frontend Public API Files

- `apps/customer-app/src/services/api/public.api.ts`
- `apps/delivery-agent-app/src/services/api/public.api.ts`
- `apps/vendor-panel/src/services/api/public.api.ts`
- `apps/admin-dashboard/src/services/api/public.api.ts`
- `packages/shared/api/public-api.types.ts`
- `packages/shared/api/api-response.types.ts`
- `packages/shared/api/index.ts`
- `docs/handoffs/frontend-public-api-connection.md`

## Finalized Public API Endpoints

- `GET /api/v1/public/health`
- `GET /api/v1/public/version`
- `GET /api/v1/public/system-info`
- `GET /api/v1/public/docs`
- `GET /api/v1/public/openapi.json`
- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`

## Internal Temporary API Endpoints

- `POST /api/v1/internal/system/database-write-check`
- `GET /api/v1/internal/auth/test-protected`

Internal test endpoints must be protected or removed before production launch.

## DB Fields

No new database fields created in this module.

## Verification Passed

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run build -w backend/api
npm run typecheck -w apps/customer-app
npm run typecheck -w apps/delivery-agent-app
npm run typecheck -w apps/vendor-panel
npm run typecheck -w apps/admin-dashboard
npm run lint -w apps/customer-app
npm run lint -w apps/delivery-agent-app
npm run lint -w apps/vendor-panel
npm run lint -w apps/admin-dashboard
node -e "JSON.parse(require('fs').readFileSync('docs/contracts/postman/zepto-like-phase-1.postman_collection.json','utf8')); console.log('valid')"
```

## Runtime Verification Passed

Backend dev server started with MongoDB reachable via local `backend/api/.env` (`DB_MONGO_URI` not printed or committed). Ports `5000` and `5010` were already in use during this continuation, so commands used port `5020`:

```bash
APP_ENV=development APP_PORT=5020 APP_VERSION=1.0.0 npm run dev -w backend/api
```

Completed runtime checks:

- `curl -s http://localhost:5020/api/v1/public/health` returned `200` with database `connected`.
- `curl -s http://localhost:5020/api/v1/public/version` returned `200`.
- `curl -s http://localhost:5020/api/v1/public/system-info` returned `200`.
- `curl -L -s -o /private/tmp/zepto-module9-docs.html -w "%{http_code}" http://localhost:5020/api/v1/public/docs` returned `200` at the trailing-slash Swagger UI route.
- `curl -s -o /private/tmp/zepto-module9-openapi.json -w "%{http_code}" http://localhost:5020/api/v1/public/openapi.json` returned `200` with valid OpenAPI JSON.
- `curl -s -X POST http://localhost:5020/api/v1/public/auth/request-otp -H "Content-Type: application/json" -d '{"phone":"123","role":"customer"}'` returned `422` with `VALIDATION_ERROR` and a `phone` field error.
- Customer App Metro started with `API_BASE_URL=http://localhost:5020` on port `8081`.
- Delivery Agent App Metro started with `API_BASE_URL=http://localhost:5020` on port `8082`.
- Vendor Panel Vite started with `VITE_API_BASE_URL=http://localhost:5020` on port `5173`; `/login` and `/dashboard` returned `200`.
- Admin Dashboard Vite started with `VITE_API_BASE_URL=http://localhost:5020` on port `5174`; `/login` and `/dashboard` returned `200`.

Earlier historical attempts failed when MongoDB was not reachable from the current machine or network (Atlas server selection or TLS errors, or closed local MongoDB port). Those environments still need a reachable `DB_MONGO_URI` target before this smoke sequence can pass.

## Known Pending Items

- Detailed customer, delivery, vendor, and admin resource contracts will be added by their owning modules.
- Swagger docs should be disabled or protected in production.
- Internal test endpoints must be protected or removed before production launch.
- API contract tests can be automated later in CI/CD.
- Backend runtime smoke on a new machine still requires MongoDB reachable at `DB_MONGO_URI` (Atlas Network Access for Atlas, or local MongoDB when using a local URI).

## Required Credentials/Env Values For Next Task

| Variable or requirement | Purpose | Expected format/example without real secrets | Where to add it | Blocked without it |
| --- | --- | --- | --- | --- |
| Reachable MongoDB at `DB_MONGO_URI` | Allows backend startup and API contract curl smoke | Atlas cluster with Network Access for the current network, or `mongodb://localhost:27017/zepto_like_dev` with local `mongod` running | Local `backend/api/.env` or shell env | Yes, for backend runtime smoke |
| `DB_MONGO_URI` | MongoDB connection string used by backend startup | `mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority` or local URI | Local `backend/api/.env` | Yes, for DB-backed runtime smoke |
