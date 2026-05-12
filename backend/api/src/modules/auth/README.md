# Auth Module

## Purpose

The auth module owns authentication foundation code for the backend API.

## Folder Responsibilities

- `controllers`: auth HTTP controller functions.
- `services`: auth business and token service functions.
- `repositories`: auth data access functions.
- `models`: Mongoose models for auth-owned collections.
- `validators`: request validation schemas for auth APIs.
- `routes`: auth route registration.
- `types`: auth TypeScript domain types.
- `constants`: auth roles, statuses, token constants, and permission groups.
- `middlewares`: authentication and authorization middleware.
- `utils`: auth-specific utility functions.

## Phase 1 Boundary

Phase 1 creates auth structure only. Real OTP login and session management will
be implemented in later authentication modules.

No real OTP sending, SMS provider integration, Firebase OTP integration, real
JWT signing, refresh token rotation, or production token lifecycle behavior is
implemented in this foundation ticket.
