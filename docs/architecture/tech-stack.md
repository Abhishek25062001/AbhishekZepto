# Tech Stack

## Purpose

This document defines the approved technology direction for Phase 1 of the
Zepto-like quick-commerce platform.

Phase 1 focuses on a safe MVP foundation using a modular monolith backend,
separate frontend apps, MongoDB-first persistence, and Redis-ready supporting
infrastructure.

## Backend Stack

The Phase 1 backend stack is:

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

The backend should be structured as one modular application with clear internal
domain boundaries. Future domains include authentication, catalog, inventory,
orders, delivery, payments, refunds, notifications, promotions, support, and
admin operations.

## Backend Supporting Tools

The Phase 1 backend should be ready to use:

- Redis for caching, rate limiting, session support, queue support, inventory
  locks, and real-time coordination
- Socket.io for future real-time order and delivery updates
- BullMQ for future background jobs
- Zod or Joi for request validation
- JWT for access and refresh token handling
- Pino or Winston for structured logging
- Helmet for API security headers
- CORS middleware for controlled frontend access

These tools should be introduced only when their owning module requires them.

## Customer App Stack

The Customer App stack is:

- React Native
- TypeScript

The Customer App will serve customer-facing flows such as login, location
selection, catalog browsing, cart, checkout, payment handoff, order tracking,
order history, profile, and notifications.

## Delivery Agent App Stack

The Delivery Agent App stack is:

- React Native
- TypeScript

The Delivery Agent App will serve delivery partner flows such as login,
availability, assignment acceptance, pickup, active delivery, delivery
completion, location updates, earnings visibility, and notifications.

## Vendor Panel Stack

The Vendor Panel stack is:

- React.js
- TypeScript

The Vendor Panel will serve vendor and dark-store workflows such as scoped
catalog visibility, inventory management, incoming orders, picking, packing,
store operations, and settlement visibility.

## Admin Dashboard Stack

The Admin Dashboard stack is:

- React.js
- TypeScript

The Admin Dashboard will serve platform operations such as user management,
vendor and store management, delivery agent management, catalog oversight, order
operations, support, finance, promotions, audit logs, analytics, and settings.

## Integration Stack

The first-launch integration direction is:

- Razorpay for payment processing
- Firebase Cloud Messaging for push notifications
- Google Maps API or Mapbox for location, map, distance, and route features
- AWS S3 or Cloudinary for product and catalog media storage

Provider-specific configuration belongs to later implementation modules. This
document only records the approved direction.

## Local Development and Deployment Support

The project should later include:

- Environment-based configuration
- Local development scripts
- Type checking
- Linting
- Formatting
- Docker support for backend dependencies when the DevOps foundation module
  begins

These are not created in this ticket.

## Future-Scale Technologies

The following technologies are not part of Phase 1 implementation unless a later
phase explicitly introduces them:

- Kafka for event streaming
- Kubernetes for orchestration
- API gateway and separate BFF services
- Elasticsearch or Meilisearch for advanced search
- PostgreSQL for a strict financial ledger
- H3 for advanced geospatial dispatch optimization
- Dedicated microservices for each domain
- Advanced production monitoring and alerting stack

These technologies remain future-scale options after the MVP foundation and core
business flows are stable.
