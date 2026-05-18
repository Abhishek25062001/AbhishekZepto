# Access Control Code Quality

## Required Checks

- `npm run typecheck -w backend/api`
- `npm run lint -w backend/api`
- `npm run build -w backend/api`
- `npm run test:access-control-harness -w backend/api`
- `npm run test:access-control-scenarios -w backend/api`
- `npm run test:access-control-smoke -w apps/customer-app`
- `npm run test:access-control-smoke -w apps/delivery-agent-app`
- `npm run test:access-control-smoke -w apps/vendor-panel`
- `npm run test:access-control-smoke -w apps/admin-dashboard`
- `npm run validate:postman:phase-2-access-control`
- `npm run typecheck -w apps/customer-app`
- `npm run lint -w apps/customer-app`
- `npm run typecheck -w apps/delivery-agent-app`
- `npm run lint -w apps/delivery-agent-app`
- `npm run typecheck -w apps/vendor-panel`
- `npm run lint -w apps/vendor-panel`
- `npm run build -w apps/vendor-panel`
- `npm run typecheck -w apps/admin-dashboard`
- `npm run lint -w apps/admin-dashboard`
- `npm run build -w apps/admin-dashboard`
- `npm run check:frontend-secrets`
- `npm run check:secrets`

## Backend Access-Control Harness

Ticket 13 introduced a reusable backend harness under:

- `backend/api/src/testing/access-control/fixtures/`
- `backend/api/src/testing/access-control/helpers/`
- `backend/api/src/testing/access-control/access-control-harness.test.ts`

Run the harness bootstrap test with:

```bash
npm run test:access-control-harness -w backend/api
```

Ticket 14 added automated scenario suites on top of this harness:

```bash
npm run test:access-control-scenarios -w backend/api
```

Scenario files live under `backend/api/src/testing/access-control/scenarios/`.

## Frontend Access-Control Smoke (Ticket 15)

Each Phase 2 app exposes:

```bash
npm run test:access-control-smoke -w apps/<app-name>
```

Smoke utilities live under `apps/*/src/access-control/` and use `node:test` with a
small `tsconfig.smoke.json` compile step (no Jest/Vitest/RNTL added).

## Postman Access-Control Collection (Ticket 16)

- Collection: `docs/contracts/postman/phase-2-access-control.postman_collection.json`
- JSON validation: `npm run validate:postman:phase-2-access-control`
- Execution: import into Postman and run against a local seeded API (Newman not bundled)

## Review Rules

- auth screens and protected auth surfaces should not make direct `axios` calls
- tracker docs must match the latest completed Phase 2 module
- access-control verification docs must map to real implemented endpoints only
- new access-control tests should reuse harness helpers instead of duplicating mock request setup
