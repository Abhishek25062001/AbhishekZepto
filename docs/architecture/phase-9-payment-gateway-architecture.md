# Phase 9 Payment Gateway Architecture

## First-Launch Provider

**Razorpay** — extends Phase 4 payment gateway foundation.

## Payment Creation Flow

1. Customer checkout confirms order payable amount (`orders.grandTotal` / `payableAmount`)
2. Backend creates `payment_records` entry (Phase 4: `payments`)
3. Backend creates Razorpay order via gateway adapter
4. Backend returns gateway order data to Customer App
5. Customer App opens Razorpay checkout SDK
6. Gateway success callback sends payment details to backend verify endpoint
7. Backend verifies signature
8. Backend marks `payment_records.paymentStatus = paid`
9. Backend updates `orders.paymentStatus = paid` and order finance summary
10. Audit log written; optional internal event emitted

## Payment Webhook Flow

1. Razorpay webhook received at public webhook endpoint
2. Webhook signature verified (`RAZORPAY_WEBHOOK_SECRET`)
3. Event deduplicated using `payment_records.webhookEventIds`
4. Payment record updated
5. Order finance summary updated
6. Audit log written
7. Notification/internal event emitted if required

## Gateway Failure Flow

1. Failed gateway event or verify failure updates `payment_records.paymentStatus = failed`
2. `orders.paymentStatus = failed`
3. `orders.financeStatus = unpaid` (when field exists)
4. Failure reason saved without exposing sensitive gateway payload to frontend
5. Checkout reservation release follows existing Phase 4 compensation rules

## Existing Phase 4 Baseline

| Planned (Phase 9) | Implemented (Phase 4) |
|-------------------|----------------------|
| `POST /api/v1/customer/payments/create-order` | IMPLEMENTED |
| `POST /api/v1/customer/payments/:paymentId/verify` | `POST /api/v1/customer/payments/verify` IMPLEMENTED |
| `POST /api/v1/public/webhooks/payments/razorpay` | `POST /api/v1/webhooks/razorpay` IMPLEMENTED |

Module 2+ may align path naming; Module 1 documents target architecture only.

## DB Fields Touched In Flows

| Collection | Fields |
|------------|--------|
| `payment_records` | `gateway*`, `paymentStatus`, `webhookEventIds`, `paidAt`, `failedAt` |
| `orders` | `paymentStatus`, `paymentRecordId`/`paymentId`, `paidAt`, `financeStatus` |

## Related Documents

- `docs/database/phase-9-payment-record-schema.md`
- `docs/database/phase-9-order-financial-summary-schema.md`
- `docs/contracts/payment-api.md` (Phase 4)
- `docs/setup/phase-9-finance-env-config.md`
