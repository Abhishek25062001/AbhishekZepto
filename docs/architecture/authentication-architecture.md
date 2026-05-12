# Authentication Architecture

## Authentication Architecture Goal

This module converts the Phase 1 auth placeholders into a real OTP-based authentication architecture. It defines the surfaces, user roles, token/session model, authorization boundaries, and planned contracts that later Phase 2 modules will implement.

This document is architecture-only. It does not implement backend auth logic, frontend login flows, or repository/bootstrap setup.

## Authentication Surfaces

Supported login surfaces:

- Customer App
- Delivery Agent App
- Vendor Panel
- Admin Dashboard

## Supported User Types

Supported user roles:

- `customer`
- `delivery_agent`
- `vendor_owner`
- `store_manager`
- `store_staff`
- `support_admin`
- `operations_admin`
- `super_admin`

## Authentication Method

OTP-based login is the primary authentication method for Phase 2.

## Phase Scope

In scope:

- OTP request architecture
- OTP verification architecture
- JWT access token architecture
- Refresh token architecture
- Session architecture
- Logout architecture
- Role-based access architecture
- Permission-based access architecture
- Device/session tracking architecture

## Out Of Scope

Excluded from this module:

- Social login
- Password login
- Biometric login
- SSO
- OAuth provider login
- Advanced fraud detection
- Production SMS vendor failover

## API Endpoints

- `POST /api/v1/public/auth/request-otp`
- `POST /api/v1/public/auth/verify-otp`
- `POST /api/v1/public/auth/refresh-token`
- `POST /api/v1/public/auth/logout`
- `GET /api/v1/internal/auth/test-protected`

## DB Fields

- `user_identities.phone`
- `user_identities.email`
- `user_identities.role`
- `user_identities.accountStatus`
- `auth_sessions.userId`
- `auth_sessions.refreshTokenHash`
- `auth_sessions.expiresAt`
- `auth_sessions.isRevoked`
- `otp_challenges.phone`
- `otp_challenges.role`
- `otp_challenges.otpHash`
- `otp_challenges.expiresAt`
- `otp_challenges.attemptCount`

## User Identity Model

Collection name: `user_identities`

Planned model file path:

- `/backend/api/src/modules/auth/models/user-identity.model.ts`

Fields:

- `phone: string`
- `email: string | null`
- `name: string | null`
- `role: AuthRole`
- `accountStatus: active | inactive | blocked | suspended | pending_approval | deleted`
- `permissions: string[]`
- `vendorId: ObjectId | null`
- `storeId: ObjectId | null`
- `cityId: ObjectId | null`
- `lastLoginAt: Date | null`
- `createdBy: ObjectId | null`
- `updatedBy: ObjectId | null`
- `status`
- `isDeleted`
- `deletedAt`
- `createdAt`
- `updatedAt`

Index rules:

- Unique index rule: `phone + role`
- Sparse email index rule: `email`
- Scoped user lookup index rule: `vendorId + storeId + role`

User identity rules:

- One phone number can exist in multiple roles only when required by business logic.
- Backend must check `accountStatus` before issuing tokens.
- Blocked, suspended, deleted, and inactive users must not receive active sessions.
