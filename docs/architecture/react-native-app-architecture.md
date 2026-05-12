# React Native App Architecture

## Purpose

This document defines the shared foundation pattern for the Customer App and
Delivery Agent App.

Both mobile apps use React Native and TypeScript. They should follow the same
folder, navigation, API, state, and storage structure so future feature modules
can move consistently across the two apps.

## Shared Mobile Architecture Goal

The Customer App and Delivery Agent App should keep a consistent architecture:

- screens own screen composition and local display states
- navigators own route structure and auth-aware routing
- API calls go through service files
- local app state lives in Zustand stores
- server state lives in TanStack Query hooks
- session tokens are loaded from secure storage into the auth store
- reusable UI belongs in common component folders

Screens must not call Axios directly. Screens should call hooks or service
functions owned by the app. Auth tokens must come from the auth store or session
storage flow. Reusable UI components should stay reusable and not include
feature-specific business rules.

## Customer App Root Structure

```text
apps/customer-app/src/app
apps/customer-app/src/screens
apps/customer-app/src/components
apps/customer-app/src/services
apps/customer-app/src/store
apps/customer-app/src/hooks
apps/customer-app/src/types
apps/customer-app/src/utils
apps/customer-app/src/config
apps/customer-app/src/assets
```

## Delivery Agent App Root Structure

```text
apps/delivery-agent-app/src/app
apps/delivery-agent-app/src/screens
apps/delivery-agent-app/src/components
apps/delivery-agent-app/src/services
apps/delivery-agent-app/src/store
apps/delivery-agent-app/src/hooks
apps/delivery-agent-app/src/types
apps/delivery-agent-app/src/utils
apps/delivery-agent-app/src/config
apps/delivery-agent-app/src/assets
```

## Shared Mobile Rules

- Screens must not call Axios directly.
- Screens must use API service files or hooks built on API service files.
- Public backend calls belong in `src/services/api/public.api.ts`.
- Future auth backend calls belong in `src/services/api/auth.api.ts`.
- Auth tokens must come from the auth store or session storage service.
- Access tokens and refresh tokens must not be stored in plain AsyncStorage.
- UI components under `src/components/common` must stay reusable.
- Backend API responses should follow the standard backend response envelope.
- Business-critical truth remains on the backend.

