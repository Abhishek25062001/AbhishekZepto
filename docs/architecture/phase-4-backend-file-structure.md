# Phase 4 Backend File Structure

Status: **PLANNED** — Module 0 does not create runtime files.

## Module Paths

```text
backend/api/src/modules/
  customer-addresses/
    models/
    repositories/
    services/
    controllers/
    routes/
    validators/
    types/
    constants/
  home/
    services/
    controllers/
    routes/
  cart/
    models/
    repositories/
    services/
    controllers/
    routes/
    validators/
  pricing/                    # IMPLEMENTED — Module 5
    services/
    utils/
    types/
    constants/
  checkout/                   # IMPLEMENTED — Module 6
    models/
    repositories/
    services/
    controllers/
    routes/
    validators/
    types/
    constants/
    utils/
  payment/                    # IMPLEMENTED — Module 8
    models/
    repositories/
    services/
    controllers/
    routes/
    validators/
    gateways/
      razorpay.gateway.ts
    middlewares/
      razorpay-webhook-signature.middleware.ts
  orders/                     # IMPLEMENTED — Module 10
    models/
    repositories/
    services/
    controllers/
    routes/
    validators/
    types/
    constants/
    utils/
  profile/                    # IMPLEMENTED — Module 12
    services/
    controllers/
    routes/
    validators/
    types/
    repositories/
    utils/
    constants/
```

## Route Mounting

All customer routers imported from `backend/api/src/routes/v1/customer.routes.ts`.

Webhooks: `backend/api/src/routes/v1/webhooks.routes.ts`.

## Convention

Mirror Phase 3 catalog modules: controllers thin, services own logic, repositories own persistence.

## Module 0 Rule

**No folders or `.ts` files created** under these paths until the owning implementation module ticket runs.
