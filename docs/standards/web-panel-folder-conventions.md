# Web Panel Folder Conventions

## Purpose

This standard defines file and folder naming conventions for the Vendor Panel
and Admin Dashboard.

## Root Folders

Each React web panel should use this root shape:

```text
src/app
src/pages
src/layouts
src/components
src/services
src/store
src/hooks
src/types
src/utils
src/config
src/assets
```

## Page Naming

Page files must use PascalCase and end with `Page.tsx`.

Examples:

```text
LoginPage.tsx
DashboardPage.tsx
OrdersPage.tsx
UsersPage.tsx
```

## Layout Naming

Layout files must use PascalCase and end with `Layout.tsx`.

Examples:

```text
AuthLayout.tsx
DashboardLayout.tsx
```

## Component Naming

Reusable component files must use PascalCase.

Examples:

```text
Button.tsx
Input.tsx
Sidebar.tsx
PageContainer.tsx
```

## Hook Naming

Hook files must use camelCase and start with `use`.

Examples:

```text
useBackendHealth.ts
useRestoreVendorSession.ts
useRestoreAdminSession.ts
```

## Service Naming

API service files must use kebab-style feature names followed by `.api.ts`.

Examples:

```text
public.api.ts
auth.api.ts
```

Other service files should describe the service and end with `.service.ts`.

Examples:

```text
session-storage.service.ts
```

## Store Naming

Store files must use the feature name followed by `.store.ts`.

Examples:

```text
auth.store.ts
ui.store.ts
```

