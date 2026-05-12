# Mobile State Management

## Purpose

This standard defines local and server state rules for the Customer App and
Delivery Agent App.

## Local App State

Use Zustand for local app state.

Examples:

- mobile auth session state
- selected Customer App address and store IDs
- Delivery Agent App availability status
- current delivery assignment placeholders

## Server State

Use TanStack Query for server state.

Examples:

- backend health checks
- public backend version checks
- future authenticated API data

## Duplication Rule

API response data should not be duplicated in Zustand unless required for
session state or offline state.

## Customer App State Fields

```text
accessToken
refreshToken
customerId
isAuthenticated
selectedAddressId
selectedStoreId
serviceableCityId
```

## Delivery Agent App State Fields

```text
accessToken
refreshToken
deliveryAgentId
isAuthenticated
availabilityStatus
currentOrderId
currentAssignmentId
currentDeliveryStatus
```

