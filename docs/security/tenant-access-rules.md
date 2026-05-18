# Tenant Access Rules

## Purpose

This document captures the current Phase 2 tenant access rules that are
implemented and verifiable in code.

## Allowed rules

- vendor/store scoped routes use the existing vendor/store scope middleware
- city scoped routes use the existing city scope middleware
- customer tenant-access test lookup allows:
  - the customer matching `customerId`
  - an admin override through the current `users:read` permission model
- delivery-agent tenant-access test lookup allows:
  - the delivery agent matching `deliveryAgentId`
  - an admin override through the current `users:read` permission model

## Denied rules

- a missing required vendor/store/city scope is denied
- a mismatched required vendor/store/city scope is denied
- a customer cannot read another customer's internal tenant-access records
- a delivery agent cannot read another delivery agent's internal tenant-access records
- a non-admin without the current read-self permission model cannot use the
  internal customer or delivery-agent lookup routes

## Admin override rules

Currently supported and testable:

- customer lookup admin override: supported for admin roles with `users:read`
- delivery-agent lookup admin override: supported for admin roles with `users:read`

Currently not proven as supported:

- vendor scoped admin override
- store scoped admin override
- city scoped admin override

These remain `NEEDS VERIFICATION`. The current code intentionally does not
invent a separate override permission namespace.

## Expected audit events

- `security.tenant_access_denied`
- `security.tenant_scope_mismatch`
- `security.tenant_admin_override_used` when the supported customer or
  delivery-agent admin override path is used

## Expected audit metadata

- `actorId`
- `actorRole`
- `actorSurface`
- `requestedScope`
- `allowedScope`
- `entityType` / `entityId` when available
- `requestId` / `traceId` when available

Current metadata also includes:

- `scopeKind`
- `field`
- `reason`
- `overridePermission` when an override path is relevant

## Sensitive values that must not be logged

- access tokens
- refresh tokens
- OTP codes
- refresh token hashes
- raw authentication headers

## Notes

- current scope deny and mismatch audit coverage is provable in backend tests
- current customer/delivery admin override usage is provable in backend tests
- vendor/store/city admin override semantics remain explicitly deferred rather
  than guessed
