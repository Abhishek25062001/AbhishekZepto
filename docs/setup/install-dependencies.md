# Install Dependencies

## Root Install

Run from the repository root:

```bash
npm install
```

This installs all configured npm workspaces.

## Workspace Installs

Use workspace-specific installs only when you intentionally need to refresh one
workspace:

```bash
npm install -w backend/api
npm install -w apps/vendor-panel
npm install -w apps/admin-dashboard
npm install -w apps/customer-app
npm install -w apps/delivery-agent-app
```

## Current Install State

The repository already has `package-lock.json` and `node_modules` from previous
foundation verification. Do not remove or regenerate the lockfile unless the
current ticket changes dependencies.

## Dependency Rule

Add dependencies only when the current module needs them. Redis clients,
Socket.IO, BullMQ, payment SDKs, Firebase, map providers, media storage SDKs,
and formal test frameworks remain deferred until their owning modules.
