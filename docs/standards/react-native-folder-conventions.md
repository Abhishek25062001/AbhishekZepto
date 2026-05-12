# React Native Folder Conventions

## Purpose

This standard defines file and folder naming conventions for the Customer App
and Delivery Agent App.

## Root Folders

Each React Native app should use this root shape:

```text
src/app
src/screens
src/components
src/services
src/store
src/hooks
src/types
src/utils
src/config
src/assets
```

## Screen Naming

Screen files must use PascalCase and end with `Screen.tsx`.

Examples:

```text
LoginScreen.tsx
HomeScreen.tsx
DeliveryHomeScreen.tsx
ActiveDeliveryScreen.tsx
```

## Component Naming

Reusable component files must use PascalCase.

Examples:

```text
Button.tsx
Input.tsx
ScreenWrapper.tsx
ErrorView.tsx
```

## Hook Naming

Hook files must use camelCase and start with `use`.

Examples:

```text
useAppNavigation.ts
useBackendHealth.ts
useRestoreCustomerSession.ts
useRestoreDeliverySession.ts
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
secure-storage.service.ts
session-storage.service.ts
```

## Store Naming

Store files must use the feature name followed by `.store.ts`.

Examples:

```text
auth.store.ts
app.store.ts
delivery.store.ts
```

