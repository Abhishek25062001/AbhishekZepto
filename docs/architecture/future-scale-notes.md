# Future Scale Notes

## Purpose

This document records advanced architecture options that are intentionally
deferred beyond Phase 1.

The project research describes a high-scale quick-commerce platform, but Phase 1
must stay focused on foundation, correctness, and MVP delivery speed.

## Phase 1 Scope Protection

The following items are not Phase 1 implementation tasks:

- Microservices
- Kafka
- Kubernetes
- API gateway and separate BFF services
- Elasticsearch or Meilisearch
- PostgreSQL double-entry ledger
- H3 geospatial dispatch optimization
- Advanced dispatch algorithms
- Dedicated event streaming platform
- Multi-region infrastructure
- Advanced production monitoring stack
- Production secret manager
- ML-based fraud detection or dispatch automation

These items should be considered only when the core platform is stable and the
relevant later phase introduces them.

## Microservices

Future microservices may separate domains such as authentication, catalog,
inventory, orders, delivery, payments, finance, notifications, promotions, and
support.

Phase 1 will not split services. It will use a modular monolith backend with
clear internal module boundaries so future extraction remains possible.

## Kafka and Event Streaming

Kafka may later support durable event streaming for order events, inventory
events, delivery tracking, payment webhooks, support workflows, analytics, and
cache invalidation.

Phase 1 will not introduce Kafka. Background work and asynchronous processing
can be prepared through simpler queue-ready patterns in later foundation tasks.

## Kubernetes

Kubernetes may later support service orchestration, autoscaling, rolling
deployments, and production-grade infrastructure management.

Phase 1 will not introduce Kubernetes. Deployment consistency can be prepared
later through simpler local development and Docker foundations.

## Advanced Search

Elasticsearch or Meilisearch may later support typo-tolerant product search,
faceted filtering, weighted ranking, and search analytics.

Phase 1 catalog search should stay MongoDB-first unless a later phase explicitly
adds a search service.

## Financial Ledger Scale-Up

PostgreSQL may later be introduced for a strict double-entry financial ledger,
wallets, payouts, reconciliation, and audit-safe accounting.

Phase 1 keeps MongoDB as the primary system database and defers ledger-grade
finance architecture to later payment, settlement, and scale-readiness phases.

## H3 and Advanced Dispatch

H3 geospatial indexing may later support high-scale rider clustering, dispatch
optimization, heatmaps, and zone-level delivery operations.

Phase 1 should not depend on H3. Initial delivery flows can use simpler
store-area and location models until delivery scale requires optimization.

## API Gateway and BFF Split

An API gateway and separate backend-for-frontend services may later improve
routing, rate limiting, aggregation, and surface-specific API shaping.

Phase 1 will not split BFFs. The backend should still keep routes grouped by
surface so a future split remains possible.

## Future Review Rule

Any future-scale technology must have a clear reason before adoption:

- Current Phase 1 structure can no longer safely support the workload.
- The target phase explicitly requires the technology.
- The added operational complexity is justified by a real product or scale need.
- The migration path is documented before implementation begins.
