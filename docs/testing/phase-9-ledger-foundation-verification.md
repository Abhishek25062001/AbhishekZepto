# Phase 9 Ledger Foundation Verification

## Commands

```bash
npm run typecheck -w backend/api
npm run lint -w backend/api
npm run test:ledger -w backend/api
npm run test:customer-payment -w backend/api
npm run test:seed-matrix -w backend/api
npm run test:customer-orders -w backend/api
npm run typecheck -w packages/shared
```

## OpenAPI Verification

```bash
npm run build -w backend/api && node -e "
const { openApiDocument } = require('./backend/api/dist/docs/openapi');
const paths = JSON.stringify(openApiDocument.paths || {});
const ok = paths.includes('/admin/finance/ledger');
console.log(ok ? 'PASS' : 'FAIL');
"
```

Expected paths:

- `/admin/finance/ledger/accounts`
- `/admin/finance/ledger/accounts/{accountId}`
- `/admin/finance/ledger/accounts/{accountId}/lines`
- `/admin/finance/ledger/journals`
- `/admin/finance/ledger/journals/{journalId}`
- `/admin/finance/ledger/journals/{journalId}/reverse`

## Route Registry Verification

```bash
grep -q "admin/finance/ledger" docs/contracts/backend-route-registry.md && echo PASS
```

## Seed Helper

```bash
# System ledger accounts seeded via seed runner (non-production)
npm run typecheck -w backend/api
```

## Foundation Docs Gate

```bash
test -f docs/architecture/ledger-foundation.md && \
test -f docs/architecture/phase-9-ledger-migration-strategy.md && \
test -f docs/contracts/ledger-foundation-api.md && \
test -f docs/database/ledger-foundation-schema.md && echo PASS
```
