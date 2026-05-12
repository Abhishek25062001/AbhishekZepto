# Local Folder Structure

## Monorepo Folders

```text
ZeptoProject/
  backend/
    api/
  apps/
    customer-app/
    delivery-agent-app/
    vendor-panel/
    admin-dashboard/
  packages/
    shared/
  docs/
    architecture/
    contracts/
    design/
    handoffs/
    reviews/
    setup/
    standards/
  project-context/
  scripts/
```

## Folder Responsibilities

- `backend/api`: Node.js, Express, TypeScript, MongoDB backend API.
- `apps/customer-app`: Customer React Native app.
- `apps/delivery-agent-app`: Delivery agent React Native app.
- `apps/vendor-panel`: Vendor React web panel.
- `apps/admin-dashboard`: Admin React web dashboard.
- `packages/shared`: stable shared types and constants.
- `docs`: architecture, setup, standards, contracts, reviews, and handoffs.
- `project-context`: persistent status and standards for future Codex chats.
- `scripts`: local developer helper scripts.

## Boundary Rule

Local setup files must not introduce product behavior. Feature APIs, screens,
models, queues, real Redis usage, and production deployment belong to their
owning modules.
