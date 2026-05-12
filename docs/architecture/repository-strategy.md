# Repository Strategy

## Decision

Phase 1 will use a monorepo.

The repository will keep the backend, mobile apps, web panels, shared package,
and project documentation inside one project root. This supports faster MVP
development, shared standards, and simpler local setup while the product is
still being shaped.

## Planned Root Structure

```text
ZeptoProject/
  apps/
    customer-app/
    delivery-agent-app/
    vendor-panel/
    admin-dashboard/
  backend/
    api/
  docs/
  packages/
    shared/
```

## Planned Surface Ownership

- `apps/customer-app`: React Native Customer App.
- `apps/delivery-agent-app`: React Native Delivery Agent App.
- `apps/vendor-panel`: React.js Vendor Panel.
- `apps/admin-dashboard`: React.js Admin Dashboard.
- `backend/api`: Node.js + Express + TypeScript backend API.
- `packages/shared`: future shared types, constants, and API contracts.
- `docs`: architecture, standards, setup, contracts, database, security, and
  review documentation.

## Why Monorepo For Phase 1

A monorepo is the right Phase 1 choice because it:

- Keeps setup simpler while the codebase is empty.
- Makes shared TypeScript, formatting, and lint rules easier to align.
- Keeps API, app, backend, and shared-type changes visible in one place.
- Supports faster MVP development.
- Reduces coordination overhead while foundations are being created.
- Allows common documentation to stay beside the implementation.

## Future Split Strategy

The monorepo does not prevent future separation.

When the product is stable and team or deployment boundaries require it, these
areas can be split into separate repositories:

- backend API
- Customer App
- Delivery Agent App
- Vendor Panel
- Admin Dashboard
- shared contracts package

A split should happen only after clear ownership, release process, deployment,
and package versioning needs exist.

## Current Module Boundary

This document records the repository strategy only. It does not create backend
source code, app source code, API routes, database models, UI screens, package
installs, or feature logic.
