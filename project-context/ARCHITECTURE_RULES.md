# Architecture Rules

## Phase 1 Architecture

Use a modular monolith backend with separate frontend apps.

Approved Phase 1 direction:

- Backend: Node.js + Express + TypeScript.
- Database: MongoDB with Mongoose.
- Customer App: React Native + TypeScript.
- Delivery Agent App: React Native + TypeScript.
- Vendor Panel: React.js + TypeScript.
- Admin Dashboard: React.js + TypeScript.
- Shared package: `packages/shared` for stable shared types/constants only when actually needed.

## Backend Authority

The backend owns:

- authentication and authorization
- permission checks
- tenant, vendor, store, city, customer, and delivery-agent scope checks
- request validation
- business calculations
- database persistence
- order lifecycle state transitions
- delivery lifecycle state transitions
- payment verification
- refund decisions
- settlement and earning records
- audit logging
- notification orchestration
- real-time event source of truth

Controllers must stay thin. Business rules belong in services. Data access belongs in repositories when repositories are introduced.

## Frontend Boundaries

Frontend apps own:

- screens
- navigation
- UI state
- local loading/empty/error states
- API client calls
- push-notification display

Frontend apps must not own:

- final pricing
- final inventory availability
- final discounts or taxes
- payment verification
- refund decisions
- delivery assignment logic
- order or delivery lifecycle authority
- permissions or scope enforcement

## Route Boundaries

Backend routes are grouped by surface:

```text
/api/v1/public
/api/v1/customer
/api/v1/delivery
/api/v1/vendor
/api/v1/admin
/api/v1/internal
/api/v1/webhooks
```

Feature-specific routes must be added only by their owning module.

## Deferred Technologies

Do not introduce these until a later phase explicitly requires them:

- microservices
- Kafka
- Kubernetes
- Elasticsearch or Meilisearch
- H3 dispatch optimization
- advanced dispatch algorithms
- API gateway or separate BFF services
- PostgreSQL double-entry financial ledger
- advanced production monitoring stack
- production secret manager
- multi-region infrastructure
- ML-based fraud or dispatch automation

## Architecture Change Rule

Any architecture change must be documented before implementation. Update the relevant `docs/architecture`, `docs/standards`, or `project-context` file and explain why the existing architecture is insufficient.
