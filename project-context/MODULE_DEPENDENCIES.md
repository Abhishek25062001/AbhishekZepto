# Module Dependencies

## Current Completed Dependency Chain

```text
System Architecture Foundation
-> Repository & Codebase Setup
-> Backend Core Foundation
-> Database Foundation
-> Authentication Foundation
-> Frontend Foundation — React Native Apps
-> Frontend Foundation — Web Panels
-> Shared UI & Design Foundation
-> API Contract Foundation
-> DevOps & Local Development Foundation
-> Logging, Monitoring & Debug Foundation
-> Security Foundation
-> Phase 1 Integration & Review
```

## Current Next Step

Phase 1 is complete. Do not start Phase 2 or any later module until the user
explicitly gives permission.

```text
await user permission for Phase 2
```

Last source-verified module:

```text
projectin micro/doctwo/PhaesDetail1&2.pdf pages 272-311
```

Current ticket status:

```text
Module 13 Ticket 1: Connectivity checklist and handoff — completed
Module 13 Ticket 2: Folder structure review — completed
Module 13 Ticket 3: Standards review — completed
Module 13 Ticket 4: Quality gates — completed
Module 13 Ticket 5: API contract review — completed
Module 13 Ticket 6: Database review — completed
Module 13 Ticket 7: Security baseline review — completed
Module 13 Ticket 8: Frontend foundation review — completed
Module 13 Ticket 9: Technical handoff — completed
Module 13 Ticket 10: Final Phase 1 architecture review — completed
Module 13 Ticket 11: Final docs index update — completed
```

Immediate safe next action:

```text
Wait for explicit user permission before creating or executing Phase 2 tickets.
```

Do not jump to Phase 2 or later modules without explicit user permission.

## General Backend Dependency Order

Future backend modules should generally follow this dependency logic:

```text
environment/config
-> response/error/validation/middleware
-> database connection
-> auth/session foundation
-> roles/permissions/scope checks
-> user/customer/vendor/store/delivery identities
-> catalog/store/inventory foundations
-> cart/checkout/order lifecycle
-> delivery lifecycle/tracking
-> payments/refunds
-> notifications/realtime
-> admin operations/audit logs/analytics/exports
```

This is a dependency guide, not a replacement for phase micro-task documents.

## Completed Foundation Dependencies

Already available:

- monorepo structure
- backend package skeleton
- app package skeletons
- shared package skeleton
- backend environment validation
- backend response envelope helpers
- backend centralized errors
- backend validation middleware
- backend base middleware stack
- backend route versioning
- public backend health/version/system-info endpoints
- backend module folder convention
- backend database convention helpers
- MongoDB connection lifecycle
- database base schema utilities, plugins, query helpers, and error mapper
- auth foundation models, repositories, validators, middleware, and placeholder routes
- auth API contracts
- React Native Customer App navigation, API client, state, secure storage, session restore, common UI, health hook, and error boundary foundation
- React Native Delivery Agent App navigation, API client, state, secure storage, session restore, common UI, health hook, and error boundary foundation
- Vendor Panel routing, API client, state, session storage, session restore, layout, common UI, health hook, permission visibility, and error boundary foundation
- Admin Dashboard routing, API client, state, session storage, session restore, layout, common UI, health hook, permission visibility, and error boundary foundation
- Mongo-backed runtime smoke verification against the approved Atlas development database
- mobile Metro startup verification for both React Native apps
- web Vite startup verification for Vendor Panel and Admin Dashboard
- shared design tokens, themes, form foundations, and accessibility baseline across four surfaces
- API contract docs, OpenAPI and Swagger docs routes, Postman collection, backend route registry, shared public API types, and frontend public API service contracts for public system and auth placeholder endpoints
- Local development setup docs and env-file checker script from DevOps & Local Development Foundation Ticket 1
- Docker Compose local MongoDB and backend API services from DevOps & Local Development Foundation Ticket 2
- backend Dockerfile for local Docker backend service startup
- backend Pino logger, Pino HTTP request logging, structured error logging, debug config, request tracing, and log file placeholders
- public health monitoring fields with Redis placeholder status
- frontend local error logging, API debug logging, and development-only debug placeholders across mobile and web surfaces
- monitoring/debug strategy docs and local observability check scripts
- security documentation, Helmet/CORS/body-size/request-sanitizer/rate-limit
  baseline, secret checks, frontend config/token safety checks, audit log
  foundation, access-denied audit hooks, dependency audit scripts, and CI
  security check placeholders
- Phase 1 connectivity checklist, folder/standards/API/database/security/frontend
  reviews, quality gate results, technical handoff, final architecture review,
  and docs indexes

Not available yet:

- CI workflows
- non-auth business domain models
- non-auth repositories
- real JWT verification
- real OTP provider integration
- production auth session behavior
- production browser session behavior
- real vendor/admin login flows
- Redis client
- production monitoring stack
- remote crash reporting
- realtime server
- queue worker
- formal test framework

## Surface Dependencies

Customer App depends on:

- backend API contracts
- auth/session APIs
- location/serviceability APIs
- catalog APIs
- cart/checkout/order/payment/tracking APIs
- notification setup

Delivery Agent App depends on:

- delivery-agent auth
- availability APIs
- assignment APIs
- pickup and delivery lifecycle APIs
- location update APIs
- earnings APIs
- realtime/push notification setup

Vendor Panel depends on:

- vendor/store auth and scope
- catalog/store/inventory APIs
- order queue APIs
- picking/packing/ready-for-pickup APIs
- settlement/report APIs

Admin Dashboard depends on:

- admin auth and RBAC
- user/vendor/store/delivery-agent management APIs
- catalog/inventory/order/delivery/payment/refund APIs
- audit logs
- analytics and exports

## Cross-Cutting Dependencies

Every feature module may depend on:

- validation middleware
- error handling
- response format
- auth/permission middleware once implemented
- audit logging once implemented
- shared DB field conventions
- tests and docs

## Rule

If a ticket requires a dependency that does not exist, create only the smallest dependency needed for that ticket and document it. Do not create broad future infrastructure early.
