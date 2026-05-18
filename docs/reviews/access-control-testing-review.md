# Access Control Testing Review

## Module

Phase 2 - User Access & Role-Based Entry  
Module 12 - Access Control Testing

## Completed

- added a consolidated Phase 2 access-control scope doc
- added a shared access-control role/surface test matrix
- expanded backend smoke guidance for Phase 2 access-control checks
- documented seeded-user guidance for access-control verification
- added backend happy-path and deny-path verification docs
- added mobile and web frontend verification docs
- added audit and security verification docs
- added code-quality verification guidance
- added backend automated access-control harness under `backend/api/src/testing/access-control`
- added reusable auth/request helpers and fixture constants for Module 12 tests
- added `npm run test:access-control-harness -w backend/api`
- added Ticket 14 backend scenario suites and `npm run test:access-control-scenarios -w backend/api`
- added Ticket 15 frontend guard/session smoke tests and `npm run test:access-control-smoke` per app
- added Ticket 16 Postman collection `docs/contracts/postman/phase-2-access-control.postman_collection.json`
- added `npm run validate:postman:phase-2-access-control` (JSON syntax check only)

## Boundary

This module consolidates verification and review coverage for existing Phase 2
access-control behavior.

Tickets 14–16 add automated backend scenarios, frontend guard smoke coverage, and a
Postman collection. They do not add:

- CI jobs
- Newman/Postman CLI runner dependency
- React Native Testing Library / Vitest component render tests
- business-domain authorization beyond the current auth/session/scope layer

## Residual Gap

Backend, frontend smoke, and Postman collection assets are in place. Newman-based CI
execution remains optional/external.

Live runtime verification still depends on running apps against a reachable backend for
OTP/login and end-to-end navigation flows.

`NEEDS VERIFICATION`:

- OTP request/verify and full login-route HTTP flows against a live MongoDB-backed server
- login-time account status enforcement on OTP verify routes
- mobile/web end-to-end navigation with real secure storage and browser sessions
