# Mobile Secure Storage

## Purpose

This standard defines how mobile auth session values are stored in the Customer
App and Delivery Agent App.

## Token Storage Rule

Access tokens and refresh tokens must never be stored in plain AsyncStorage.

Tokens and app identity IDs must go through the app secure storage service:

```text
src/services/storage/secure-storage.service.ts
```

## Customer App Secure Storage Keys

```text
CUSTOMER_ACCESS_TOKEN = 'customer_access_token'
CUSTOMER_REFRESH_TOKEN = 'customer_refresh_token'
CUSTOMER_ID = 'customer_id'
```

## Delivery Agent App Secure Storage Keys

```text
DELIVERY_ACCESS_TOKEN = 'delivery_access_token'
DELIVERY_REFRESH_TOKEN = 'delivery_refresh_token'
DELIVERY_AGENT_ID = 'delivery_agent_id'
```

## Session Services

Customer session storage belongs in:

```text
apps/customer-app/src/services/auth/session-storage.service.ts
```

Delivery Agent session storage belongs in:

```text
apps/delivery-agent-app/src/services/auth/session-storage.service.ts
```

