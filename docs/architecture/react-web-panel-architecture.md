# React Web Panel Architecture

## Purpose

This document defines the shared foundation pattern for the Vendor Panel and
Admin Dashboard.

Both web panels use React and TypeScript. They should follow the same folder,
routing, layout, API, state, and UI structure so operational features can be
implemented consistently.

## Shared Web Panel Architecture Goal

The Vendor Panel and Admin Dashboard should keep a consistent architecture:

- pages own page composition and local display states
- routers own route structure and session-aware routing
- layouts own reusable sidebar, header, and content areas
- API calls go through service files
- local UI and session state lives in Zustand stores
- server state lives in TanStack Query hooks
- reusable UI belongs in common component folders
- permission visibility helpers hide UI affordances only

Pages must not call Axios directly. Pages should call hooks or service
functions owned by the panel. Auth tokens must come from the auth store or
session storage flow. Layouts must stay reusable. Permissions must be enforced
by the backend; frontend checks are for visibility convenience only.

## Vendor Panel Root Structure

```text
apps/vendor-panel/src/app
apps/vendor-panel/src/pages
apps/vendor-panel/src/layouts
apps/vendor-panel/src/components
apps/vendor-panel/src/services
apps/vendor-panel/src/store
apps/vendor-panel/src/hooks
apps/vendor-panel/src/types
apps/vendor-panel/src/utils
apps/vendor-panel/src/config
apps/vendor-panel/src/assets
```

## Admin Dashboard Root Structure

```text
apps/admin-dashboard/src/app
apps/admin-dashboard/src/pages
apps/admin-dashboard/src/layouts
apps/admin-dashboard/src/components
apps/admin-dashboard/src/services
apps/admin-dashboard/src/store
apps/admin-dashboard/src/hooks
apps/admin-dashboard/src/types
apps/admin-dashboard/src/utils
apps/admin-dashboard/src/config
apps/admin-dashboard/src/assets
```

## Shared Web Panel Rules

- Pages must not call Axios directly.
- Pages must use API service files or hooks built on API service files.
- Public backend calls belong in `src/services/api/public.api.ts`.
- Future auth backend calls belong in `src/services/api/auth.api.ts`.
- Auth tokens must come from the auth store or session storage service.
- Layout components must stay reusable across panel pages.
- UI visibility permission checks must not replace backend authorization.
- Backend API responses should follow the standard backend response envelope.
- Business-critical truth remains on the backend.

