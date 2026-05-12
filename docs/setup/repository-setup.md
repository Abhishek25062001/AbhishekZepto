# Repository Setup

## Purpose

This document describes how the Phase 1 monorepo folders are intended to be
organized.

It is a setup guide for the Repository & Codebase Setup module and does not
implement application logic.

## Planned Folder Organization

```text
ZeptoProject/
  README.md
  package.json
  tsconfig.base.json
  apps/
    customer-app/
    delivery-agent-app/
    vendor-panel/
    admin-dashboard/
  backend/
    api/
  docs/
    architecture/
    setup/
    standards/
  packages/
    shared/
```

## Folder Roles

- `apps/customer-app`: Customer-facing React Native mobile app.
- `apps/delivery-agent-app`: Delivery partner React Native mobile app.
- `apps/vendor-panel`: Vendor and dark-store React.js web panel.
- `apps/admin-dashboard`: Admin and operations React.js dashboard.
- `backend/api`: Modular monolith backend API.
- `packages/shared`: shared types and constants prepared for later modules.
- `docs/architecture`: system architecture decisions and blueprints.
- `docs/setup`: repository and local development setup documentation.
- `docs/standards`: project conventions and engineering standards.

## Setup Order

Repository setup should proceed in this order:

1. Root repository files.
2. Root workspace and TypeScript base configuration.
3. Backend package skeleton.
4. App package skeletons.
5. Shared package skeleton.
6. Setup and standards documentation.
7. Repository setup review.

## Not Included Yet

This module does not implement:

- backend server bootstrap
- Express app setup
- API routes
- database models
- React Native screens
- React web pages
- navigation
- services
- stores
- components
- tests
- dependency installation
