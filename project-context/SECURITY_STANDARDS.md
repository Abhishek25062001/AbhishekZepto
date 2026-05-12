# Security Standards

## Current State

Backend security headers, request IDs, CORS middleware, body parsing, request logging, validation, and centralized error handling exist.

Authentication foundation placeholders, Bearer header parsing, role guard helpers, permission helper functions, auth models, and placeholder auth routes exist.

Real OTP verification, real JWT signing and verification, refresh token
rotation, production session revocation, rate limiting, webhook signature
verification, audit logging, and secret rotation are not implemented yet.

## Core Rules

- Never commit real secrets.
- Never expose raw secrets, tokens, OTPs, payment signatures, or stack traces to clients.
- Every protected endpoint must authenticate the caller.
- Every protected endpoint must enforce permission and scope checks.
- Every critical mutation must create audit records once audit logging exists.
- Admin, vendor, store, customer, delivery-agent, and internal scopes must be enforced by the backend.

## Authentication Expectations

JWT access and refresh tokens are the expected direction. Refresh tokens should be used only through auth refresh APIs.

Redis is expected later for sessions, revocation, rate limiting, OTP attempts, and presence where applicable.

Auth implementation is deferred to its owning module.

## Permission Expectations

Permission checks must be explicit. Do not rely on frontend routing or hidden buttons.

Protected routes should compose:

```text
authentication -> permission check -> scope check -> validation -> controller
```

Exact middleware names and implementation details belong to the auth/permission module.

## Input Security

Validate body, query, params, and relevant headers before controller execution. Reject invalid input with the standard validation error envelope.

Avoid unsafe generic filtering. List endpoints should accept documented filter fields only.

## CORS

CORS is currently middleware-based. Production CORS must not use wildcard origins. Approved frontend origins must be environment-based.

## Webhook Security

Webhook routes must verify provider signatures before processing:

- payment provider webhooks
- refund webhooks
- delivery/location provider callbacks if any
- notification provider callbacks if any

Webhook handlers must be idempotent.

## Audit Logging

Audit logging must cover sensitive actions, including:

- admin changes
- role or permission changes
- vendor/store inventory changes
- order state changes
- delivery lifecycle changes
- payment and refund actions
- support actions
- permission denials where operationally important

Audit implementation is deferred, but future critical mutations must account for it.

## Production Safety

Production must not allow:

- default JWT secrets
- missing webhook secrets
- wildcard CORS origins
- OTP development mode
- fake payment mode
- debug internal routes
- verbose error details
- committed provider credentials
