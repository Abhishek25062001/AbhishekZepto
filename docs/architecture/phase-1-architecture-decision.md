# Phase 1 Architecture Decision

## Decision

Phase 1 will use a Modular Monolith Backend with Separate Frontend Apps.

The backend will be built as one Node.js + Express + TypeScript application with
clear internal modules for future domains such as authentication, catalog,
inventory, orders, delivery, payments, notifications, and admin operations.

The frontend surfaces will remain separate applications:

- Customer App: React Native
- Delivery Agent App: React Native
- Vendor Panel: React.js
- Admin Dashboard: React.js

MongoDB is the primary database for Phase 1. Redis must be treated as
Redis-ready infrastructure for later use in caching, rate limiting, sessions,
queues, inventory locks, and real-time support, but Phase 1 should not depend on
advanced distributed infrastructure before the foundation is complete.

## Backend Direction

The Phase 1 backend direction is:

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Redis-ready architecture
- Module-based folder boundaries inside one backend application
- Shared API response, validation, error, logging, and security conventions

The backend is the source of truth for business-critical behavior, including:

- Authentication and authorization
- User and role access
- Catalog and inventory rules
- Pricing and cart calculation
- Order state
- Delivery assignment state
- Payment status
- Refund status
- Vendor settlement data
- Delivery partner earning data

Frontend applications must not own final business-critical calculations or state
transitions.

## Frontend Direction

The Phase 1 frontend direction is:

- React Native + TypeScript for the Customer App
- React Native + TypeScript for the Delivery Agent App
- React.js + TypeScript for the Vendor Panel
- React.js + TypeScript for the Admin Dashboard

Each frontend app should have its own navigation, state, API client, UI
foundation, and screen structure. Shared types and standards can be introduced
through a shared package after repository setup begins.

## Why This Approach

The provided project documents describe an enterprise quick-commerce platform,
but the first implementation phase must prioritize a safe MVP foundation.

A modular monolith is the correct Phase 1 choice because it:

- Keeps local development simpler.
- Reduces deployment complexity.
- Allows faster MVP iteration.
- Keeps domain boundaries visible without premature service splitting.
- Makes shared conventions easier to enforce.
- Avoids distributed-system complexity before core workflows exist.

Separate frontend apps are still required because the system has distinct user
surfaces with different workflows, permissions, and UI expectations.

## Explicit Phase 1 Exclusions

The following technologies and patterns are intentionally deferred beyond Phase
1:

- Microservices
- Kafka
- Kubernetes
- Elasticsearch
- H3 dispatch optimization
- Advanced dispatch algorithms
- Full API gateway and BFF split
- PostgreSQL double-entry ledger
- Advanced production monitoring
- Production secret manager
- Multi-region infrastructure
- Advanced ML or fraud automation

These items may be introduced in later scale-readiness phases after the core
system, access control, catalog, inventory, order lifecycle, delivery lifecycle,
payments, and operations layers are stable.

## Phase 1 Architecture Rule

Phase 1 must establish structure, conventions, and safe foundations before
feature implementation.

Repository bootstrap, backend source folders, app source folders, package
installation, and executable code belong to later Phase 1 modules, not this
architecture decision task.
