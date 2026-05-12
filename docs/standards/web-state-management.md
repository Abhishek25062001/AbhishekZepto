# Web State Management

## Purpose

This standard defines local and server state rules for the Vendor Panel and
Admin Dashboard.

## Local UI And Session State

Use Zustand for local UI and session state.

Examples:

- web auth session state
- sidebar open or closed state
- selected store, vendor, or city IDs
- local layout state

## Server State

Use TanStack Query for server state.

Examples:

- backend health checks
- public backend version checks
- future authenticated API data

## Duplication Rule

API response data should not be duplicated in Zustand unless required for
session, selected store, selected city, or layout state.

## Vendor Panel State Fields

```text
accessToken
refreshToken
vendorUserId
vendorId
storeId
role
permissions
isAuthenticated
sidebarOpen
activeStoreId
activeVendorId
```

## Admin Dashboard State Fields

```text
accessToken
refreshToken
adminId
role
permissions
isAuthenticated
sidebarOpen
activeCityId
activeStoreId
```

