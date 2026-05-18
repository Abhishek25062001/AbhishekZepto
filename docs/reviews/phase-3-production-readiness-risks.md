# Phase 3 Production Readiness Risks

**Date:** 2026-05-18

| Risk | Mitigation |
|------|------------|
| Local media storage in dev | Use S3/cloud provider in production; validate `media_files.storageProvider` |
| MongoDB-only catalog search | Plan Elasticsearch/Meilisearch in later phase; monitor query latency |
| Customer serviceability is city/store placeholder | Complete address/serviceability module before production launch |
| Checkout not integrated with inventory locks | Complete order module before relying on lock confirm/release |
| Seed/import accuracy for store products & stock | Operational runbooks + reconciliation jobs |
| `isPriceLocked` must block vendor price PATCH | Enforced in vendor service — regression in `test:store-products` |
| Lock TTL index must not replace explicit release/confirm | Document ops playbook; monitor `inventory_locks.status` |
| Large media uploads need CDN | Load-test upload size limits; use signed URLs at scale |
| Vendor/customer categories-brands-detail routes PLANNED | Mount or adjust customer app before live browse E2E |
| Live OTP/auth required for full API smoke | Run Postman/manual checklist in staging |

**Follow-up:** Module 17 — Phase 3 Integration & Review.
