# Testing Rules

## Current Test State

Foundation modules currently verify with:

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run typecheck -w apps/customer-app
npm run typecheck -w apps/delivery-agent-app
npm run lint -w apps/customer-app
npm run lint -w apps/delivery-agent-app
npm run typecheck -w apps/vendor-panel
npm run typecheck -w apps/admin-dashboard
npm run lint -w apps/vendor-panel
npm run lint -w apps/admin-dashboard
```

Smoke test command used:

```bash
APP_ENV=development APP_PORT=5010 APP_VERSION=1.0.0 npm run dev -w backend/api
```

Smoke-tested endpoints:

```text
GET /api/v1/public/health
GET /api/v1/public/version
GET /api/v1/public/system-info
GET /api/v1/public/unknown
```

Formal unit/integration/e2e test frameworks are not implemented yet.

Backend, Customer App, Delivery Agent App, Vendor Panel, and Admin Dashboard
checks are currently proven.

Current reliable backend commands:

```bash
npm run build -w backend/api
npm run seed:dry -w backend/api
npm run typecheck -w backend/api
npm run lint -w backend/api
```

Database Foundation runtime smoke tests require a reachable MongoDB service:

```bash
APP_ENV=development APP_PORT=5010 APP_VERSION=1.0.0 DB_MONGO_URI=mongodb://localhost:27017/zepto_like_dev npm run dev -w backend/api
curl http://localhost:5010/api/v1/public/health
curl -X POST http://localhost:5010/api/v1/internal/system/database-write-check
```

Authentication Foundation runtime smoke tests additionally require a confirmed
safe local or development MongoDB target before running `npm run seed` or
starting the backend against a configured MongoDB URI.

React Native Foundation runtime smoke checks use:

```bash
APP_PORT=5010 npm run dev -w backend/api
curl http://localhost:5010/api/v1/public/health
API_BASE_URL=http://localhost:5010 npm run start -w apps/customer-app -- --port 8081
API_BASE_URL=http://localhost:5010 npm run start -w apps/delivery-agent-app -- --port 8082
```

Web Panels Foundation checks use:

```bash
npm run typecheck -w apps/vendor-panel
npm run typecheck -w apps/admin-dashboard
npm run lint -w apps/vendor-panel
npm run lint -w apps/admin-dashboard
npm run build -w apps/vendor-panel
npm run build -w apps/admin-dashboard
VITE_API_BASE_URL=http://localhost:5010 npm run dev -w apps/vendor-panel -- --host 127.0.0.1 --port 5173
VITE_API_BASE_URL=http://localhost:5010 npm run dev -w apps/admin-dashboard -- --host 127.0.0.1 --port 5174
```

Module 9 API Contract Foundation runtime smoke passed when MongoDB was
reachable:

```bash
APP_ENV=development APP_PORT=5010 APP_VERSION=1.0.0 npm run dev -w backend/api
curl -sS http://127.0.0.1:5010/api/v1/public/health
curl -sS http://127.0.0.1:5010/api/v1/public/version
curl -sS http://127.0.0.1:5010/api/v1/public/system-info
curl -sS -L -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5010/api/v1/public/docs
curl -sS -o /dev/null -w "%{http_code}\n" -X POST http://127.0.0.1:5010/api/v1/public/auth/request-otp -H "Content-Type: application/json" -d "{}"
```

Backend live health smoke on any machine still requires a reachable `DB_MONGO_URI`
(Atlas Network Access for Atlas, or local `mongod` when using a local URI).

Root workspace-wide commands currently fail on the pre-existing
`packages/shared` skeleton:

```bash
npm run typecheck
npm run lint
```

Reason: `packages/shared` has no TypeScript inputs and no ESLint flat config.
Use workspace-specific commands until the shared package setup is completed by
its owning ticket.

## Required Future Test Coverage

Every module should include tests appropriate to risk and scope:

- validators
- services
- repositories/models
- route integration
- auth middleware
- permission middleware
- scope checks
- audit logging
- idempotency behavior
- critical state transitions
- error response envelopes

## API Test Expectations

Each endpoint should test:

- success path
- validation failure
- unauthenticated access when protected
- forbidden access for insufficient permission/scope
- not found behavior
- conflict or invalid state behavior when relevant
- audit logging for critical mutations when audit exists

## Database Test Expectations

Model/repository tests should cover:

- required fields
- indexes and unique constraints
- soft delete behavior
- scope filtering
- status transitions
- pagination behavior
- timestamps

## Realtime Test Expectations

When real-time is implemented, tests should cover:

- authenticated connection
- room join scope validation
- event emission after persisted backend state changes
- disconnect cleanup
- Redis adapter behavior if introduced

## Test Command Rule

Every ticket must report:

- commands run
- result of each command
- tests added or not added
- why tests were not added if the ticket is documentation-only or foundation-only

Do not mark a ticket complete if its required checks were skipped without explanation.

## Context Verification Rule

When a future chat changes code, it should also verify that the context files still reflect:

- current phase/module/ticket
- completed work
- remaining blockers
- new commands or test limitations
