# Phase 9 Finance Shared Contracts Plan

Status: documentation only. **No `.ts` files in Module 1.**

## Planned Package Folder

```text
packages/shared/api/finance/
```

## Planned Type Files

| File | Purpose |
|------|---------|
| `payment-record.types.ts` | Payment DTOs |
| `refund-record.types.ts` | Refund DTOs |
| `vendor-settlement.types.ts` | Settlement DTOs |
| `delivery-earning.types.ts` | Earning DTOs |
| `finance-api.types.ts` | Cross-cutting API envelopes |
| `finance-error.types.ts` | Error code unions |
| `money.types.ts` | Money amount helpers/types |

## Planned Exports

Add to `packages/shared/api/index.ts` when implementing modules:

- Customer payment request/response types
- Refund request/response types
- Admin list/detail responses
- Settlement and earning responses

## Consuming Apps

| App | Types consumed |
|-----|----------------|
| Customer App | Payment + refund customer DTOs |
| Delivery Agent App | Earning list/detail DTOs |
| Vendor Panel | Settlement summary DTOs (later) |
| Admin Dashboard | All admin finance DTOs |

## Key DTO Names (planned)

| DTO | Use |
|-----|-----|
| `CreatePaymentOrderRequest` | Customer create-order |
| `CreatePaymentOrderResponse` | Gateway payload wrapper |
| `VerifyPaymentRequest` | Customer verify |
| `PaymentRecordResponse` | Payment detail |
| `CreateRefundRequest` | Customer refund |
| `RefundRecordResponse` | Refund detail |
| `AdminPaymentListResponse` | Admin payment list |
| `AdminRefundListResponse` | Admin refund list |
| `RefundApprovalRequest` | Admin approve body |
| `VendorSettlementResponse` | Settlement detail |
| `DeliveryEarningResponse` | Earning detail |

## DB Field Mapping

| Type file | Schema doc |
|-----------|------------|
| `payment-record.types.ts` | `phase-9-payment-record-schema.md` |
| `refund-record.types.ts` | `phase-9-refund-record-schema.md` |
| `vendor-settlement.types.ts` | `phase-9-vendor-settlement-placeholder-schema.md` |
| `delivery-earning.types.ts` | `phase-9-delivery-earning-placeholder-schema.md` |

## Related Documents

- `docs/contracts/phase-9-finance-api-surface.md`
- `docs/architecture/phase-4-shared-contracts.md`
