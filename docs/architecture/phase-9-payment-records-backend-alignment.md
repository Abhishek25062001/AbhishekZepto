# Phase 9 Payment Records Backend Alignment

Status: **IMPLEMENTED**

## Runtime Files (extend/create)

| Area | Path | Action |
|------|------|--------|
| Model | `modules/payment/models/payment.model.ts` | extend |
| Types | `modules/payment/types/payment.types.ts` | extend |
| Repository | `modules/payment/repositories/payment.repository.ts` | extend |
| Validators | `modules/payment/validators/payment.validators.ts` | extend |
| Mappers | `modules/payment/utils/payment-response.mapper.ts` | extend |
| Services | `modules/payment/services/payment.service.ts` | extend |
| Order sync | `modules/payment/services/order-payment-sync.service.ts` | create |
| Webhook | `modules/payment/services/payment-webhook.service.ts` | extend |
| Controllers | `modules/payment/controllers/payment.controller.ts` | extend |
| Customer routes | `modules/payment/routes/payment.routes.ts` | extend |
| Admin routes | `modules/payment/routes/payment-admin.routes.ts` | create |
| OpenAPI | `docs/openapi/payment-records.paths.ts` | create |
| Shared types | `packages/shared/api/finance/payment-record.types.ts` | create |
| Order model | `modules/orders/models/order.model.ts` | extend |

## Permission

`finance:payments:read` via `AUTH_PERMISSION_RESOURCE.FINANCE_PAYMENTS`
