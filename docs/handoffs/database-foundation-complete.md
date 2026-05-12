# Database Foundation Handoff

## Scope

Phase 1, Module 4 establishes the backend database foundation without adding
customer, store, product, order, inventory, delivery, payment, or auth domain
features.

The backend now has:

- MongoDB connection and disconnect lifecycle.
- Graceful MongoDB shutdown from backend server signals.
- Database constants for common statuses and collection names.
- Base schema options and reusable base schema fields.
- Soft-delete and JSON Mongoose plugins.
- Pagination and query helper utilities.
- Database error mapper for duplicate key, validation, and cast errors.
- Database index strategy placeholders.
- Seed runner scaffolding with dry-run support.
- Temporary internal database write-check endpoint.
- Public health response database status.

## Created Database Utility Files

- `backend/api/src/config/database.ts`
- `backend/api/src/database/constants/db-status.constants.ts`
- `backend/api/src/database/constants/collection-names.constants.ts`
- `backend/api/src/database/base-schema-fields.ts`
- `backend/api/src/database/conventions.md`
- `backend/api/src/database/plugins/soft-delete.plugin.ts`
- `backend/api/src/database/plugins/to-json.plugin.ts`
- `backend/api/src/database/plugins/index.ts`
- `backend/api/src/database/query-helpers.ts`
- `backend/api/src/database/index.ts`
- `backend/api/src/database/database-error.mapper.ts`
- `backend/api/src/database/index-strategy.ts`
- `backend/api/src/database/seeds/index.ts`
- `backend/api/src/database/seeds/seed-runner.ts`
- `backend/api/src/database/seeds/seed-default-settings.ts`
- `backend/api/src/database/seeds/seed-roles.ts`
- `backend/api/src/database/seeds/seed-admin.ts`
- `backend/api/src/database/seeds/seed-units.ts`

## Created System Check Files

- `backend/api/src/modules/system/models/system-check.model.ts`
- `backend/api/src/modules/system/repositories/system-check.repository.ts`
- `backend/api/src/modules/system/services/system-check.service.ts`
- `backend/api/src/modules/system/controllers/system-check.controller.ts`
- `backend/api/src/modules/system/routes/system-check.routes.ts`

## Created Documentation

- `docs/setup/mongodb-local-setup.md`
- `docs/setup/database-seeding.md`
- `docs/standards/database-error-handling.md`
- `docs/standards/database-indexing.md`
- `docs/handoffs/database-foundation-complete.md`

## API Endpoints

Updated:

```http
GET /api/v1/public/health
```

Added:

```http
POST /api/v1/internal/system/database-write-check
```

The internal database write-check endpoint is temporary verification plumbing.
Authentication protection for it is deferred to Authentication Foundation.

## DB Fields

Foundation fields:

- `_id`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

Temporary `system_checks` fields:

- `key`
- `value`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

## Verified Commands

These commands passed:

```bash
npm run seed:dry -w backend/api
npm run typecheck -w backend/api
npm run lint -w backend/api
```

## Runtime Verification Blocker

Local MongoDB runtime verification could not be completed in this environment:

- `nc -z localhost 27017` did not find a reachable MongoDB service.
- `mongod` is not installed.
- `docker` is not installed.
- A compiled server bootstrap probe confirmed MongoDB connection fails with
  `ECONNREFUSED` on `localhost:27017`.

The following commands still need to be run in an environment with MongoDB:

```bash
APP_ENV=development APP_PORT=5010 APP_VERSION=1.0.0 DB_MONGO_URI=mongodb://localhost:27017/zepto_like_dev npm run dev -w backend/api
curl http://localhost:5010/api/v1/public/health
curl -X POST http://localhost:5010/api/v1/internal/system/database-write-check
```

Expected runtime result:

- Backend connects to MongoDB without startup error.
- Health endpoint returns `database.status` as `connected`.
- `system_checks` collection contains `database_connection_test`.

## Known Pending Items

- Real customer, store, product, order, inventory, and delivery models are deferred.
- Authentication protection for the internal database check endpoint is deferred.
- Production index optimization is deferred to a later stability and performance phase.
- Formal database integration tests are not implemented yet.
