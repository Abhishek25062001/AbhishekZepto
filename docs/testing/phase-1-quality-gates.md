# Phase 1 Quality Gates

## Quality Gate Goal

All code must pass lint, typecheck, build, smoke, security, and connectivity
checks before Phase 2.

## Passed Commands

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run typecheck -w apps/vendor-panel
npm run lint -w apps/vendor-panel
npm run build -w apps/vendor-panel
npm run typecheck -w apps/admin-dashboard
npm run lint -w apps/admin-dashboard
npm run build -w apps/admin-dashboard
npm run typecheck -w apps/customer-app
npm run lint -w apps/customer-app
npm run typecheck -w apps/delivery-agent-app
npm run lint -w apps/delivery-agent-app
npm run check:secrets
npm run check:frontend-secrets
```

## Failed Or Blocked Commands

```bash
npm run smoke:backend
npm run check:observability
npm run check:security-headers
npm run check:cors
npm run audit:all
```

Results:

- `npm run smoke:backend` failed because the root script is not defined.
- `npm run check:observability` failed cleanly because no backend was running at
  `http://localhost:5000`.
- `npm run check:security-headers` failed cleanly because no backend was running
  at `http://localhost:5000`.
- `npm run check:cors` failed cleanly because no backend was running at
  `http://localhost:5000`.
- `npm run audit:all` failed because npm registry DNS resolution was unavailable
  from the sandbox.

## Required Fixes

- Add or document the owning module for a root `smoke:backend` script before
  treating it as a mandatory Phase 2 gate.
- Run runtime checks with backend and MongoDB available.
- Run dependency audit with npm registry access.

## API Endpoints Checked

- `GET /api/v1/public/health`
- `GET /api/v1/public/system-info`

## DB Fields

No new database fields created in this task.
