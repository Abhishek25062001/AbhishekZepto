# Module Dependencies

## Current Completed Dependency Chain

```text
Phase 1 complete
-> Phase 2 Module 2 Authentication Architecture
-> Phase 2 Module 3 Backend Auth Core
-> Phase 2 Module 4 OTP Login System
-> Phase 2 Module 5 Role & Permission System
-> Phase 2 Module 6 Tenant & Store Access Control
-> Phase 2 Module 7 Customer App Authentication
-> Phase 2 Module 8 Delivery Agent App Authentication
-> Phase 2 Module 9 Vendor Panel Authentication
-> Phase 2 Module 10 Admin Dashboard Authentication
-> Phase 2 Module 11 Session & Device Management
-> Phase 2 Module 12 Access Control Testing
-> Phase 2 Module 13 Phase 2 Integration & Review
```

## Current Next Step

Phase 2 is complete. Do not start the next phase until the user explicitly
gives permission.

```text
await user permission for the first module of the next phase after completed Phase 2
```

## Important Note On Naming Drift

Some earlier Phase 2 work was discussed while the user accidentally referred to
the older Phase 1 phase title. The execution order still followed the correct
Phase 2 authentication and access-control chain, so the dependency order is not
broken.

## Current Ticket Status

```text
Phase 2 Module 2 Authentication Architecture -> completed
Phase 2 Module 3 Backend Auth Core -> completed
Phase 2 Module 4 OTP Login System -> completed
Phase 2 Module 5 Role & Permission System -> completed
Phase 2 Module 6 Tenant & Store Access Control -> completed
Phase 2 Module 7 Customer App Authentication -> completed
Phase 2 Module 8 Delivery Agent App Authentication -> completed
Phase 2 Module 9 Vendor Panel Authentication -> completed
Phase 2 Module 10 Admin Dashboard Authentication -> completed
Phase 2 Module 11 Session & Device Management -> completed
Phase 2 Module 12 Access Control Testing -> completed
Phase 2 Module 13 Phase 2 Integration & Review -> completed
```

## Immediate Safe Next Action

```text
Wait for explicit user permission before creating or executing the first module of the next phase.
```

## Phase 2 Dependency Order Reached So Far

The current repository now has these access-control dependencies available:

```text
OTP auth architecture
-> real backend auth core
-> real OTP login flow across backend and four frontends
-> role and permission enforcement
-> vendor/store/city scope enforcement foundation
```

## Available Now

- real OTP request, verify, refresh, and logout flows
- real JWT signing and verification
- auth session persistence
- user identity, role, auth session, and OTP challenge models
- role-permission seed matrix
- backend permission middleware
- backend vendor/store/city scope middleware
- internal auth verification routes for permission and scope checks
- shared auth API types for frontend surfaces
- customer app OTP login flow
- delivery agent app OTP login flow
- vendor panel OTP login flow
- admin dashboard OTP login flow
- customer app customer-permissions fetch and auth restore flow
- delivery agent app delivery-permissions fetch and auth restore flow
- vendor panel auth restore, vendor-permissions fetch, and OTP login flow
- vendor panel permission-aware protected entry
- admin dashboard auth restore, admin-permissions fetch, and OTP login flow
- admin dashboard permission-aware protected entry
- vendor/store/city scope-aware protected entry foundations
- auth audit logging for permission and scope denials
- authenticated session listing and targeted session revocation
- mobile and web session/device management surfaces
- consolidated access-control verification and review coverage

## Not Available Yet

- domain-specific tenant/store ownership checks inside catalog, orders,
  inventory, stores, or delivery modules
- repository-level scope filters for non-auth business records
- cross-tenant isolation inside later business services
- CI workflows
- production monitoring stack
- queue worker
- formal test framework

## Cross-Cutting Dependency Logic

The current safe order for upcoming access and business modules is:

```text
auth/session
-> roles/permissions
-> tenant/store/city scope
-> customer surface authentication
-> delivery surface authentication
-> vendor surface authentication
-> admin surface authentication
-> domain-specific ownership validation
-> repository/service-level scoped data access
-> later business workflows
```

## Rule

If a ticket requires a dependency that does not exist, create only the smallest
dependency needed for that ticket and document it. Do not create broad future
infrastructure early.

## Phase 6 Dependency Chain

```text
Phase 5 complete (Phase 6 gate)
  -> Phase 6 Module 1 — Delivery Lifecycle Architecture (completed 2026-05-21)
  -> Phase 6 Module 2 — Delivery Partner Profile Backend (completed 2026-05-21)
  -> Phase 6 Module 3 — Rider Availability & Online Status (completed 2026-05-21)
  -> Phase 6 Module 4 — Delivery Assignment Backend (completed 2026-05-22)
  -> Phase 6 Module 5 — Delivery Agent App — Availability (completed 2026-05-22)
  -> Phase 6 Module 6 — Store Arrival & Pickup Backend (completed 2026-05-22)
  -> Phase 6 Module 7 — Delivery Agent App — Pickup Flow (completed 2026-05-28)
  -> Phase 6 Module 8 — Delivery Progress Backend (completed 2026-05-28)
  -> Phase 6 Module 9 — Delivery Agent App — Active Delivery (completed 2026-05-28)
  -> Phase 6 Module 10 — Delivery Agent App — Active Delivery (completed 2026-05-28)
  -> Phase 6 Module 11 — Delivery Completion Backend (completed 2026-05-28)
  -> Phase 6 Module 12 — Delivery Agent App — Completion Flow (completed 2026-05-28)
  -> Phase 6 Module 13 — Customer App — Delivery Tracking (completed 2026-05-28)
  -> Phase 6 Module 14 — Vendor Panel — Pickup Visibility (completed 2026-05-28)
  -> Phase 6 Module 15 — Admin Dashboard — Delivery Operations (depends on 4, 11)
  -> Phase 6 Module 16 — Delivery SLA & Escalation (depends on 4, 6, 11)
  -> Phase 6 Module 17 — Delivery Notifications Placeholder (depends on 4, 6, 11)
  -> Phase 6 Module 18 — Phase 6 Testing & Validation (depends on 1-17)
  -> Phase 6 Module 19 — Phase 6 Integration & Review (depends on 18)
```
