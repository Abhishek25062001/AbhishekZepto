# Phase 9 Finance Error Codes

Stable error codes for Phase 9 finance domains. HTTP mapping per
`project-context/API_STANDARDS.md`.

## Payment Error Codes

| Code | Typical HTTP | When |
|------|--------------|------|
| `PAYMENT_RECORD_NOT_FOUND` | 404 | Payment id missing |
| `PAYMENT_ALREADY_EXISTS_FOR_ORDER` | 409 | Active payment exists |
| `ORDER_NOT_PAYABLE` | 422 | Order cannot accept payment |
| `ORDER_ALREADY_PAID` | 409 | Duplicate pay attempt |
| `INVALID_PAYMENT_AMOUNT` | 422 | Amount mismatch |
| `PAYMENT_GATEWAY_ORDER_FAILED` | 502 | Gateway order creation failed |
| `PAYMENT_SIGNATURE_INVALID` | 422 | Verify signature failed |
| `PAYMENT_WEBHOOK_SIGNATURE_INVALID` | 401 | Webhook signature failed |
| `PAYMENT_WEBHOOK_DUPLICATE_EVENT` | 409 | Webhook id already processed |
| `PAYMENT_STATUS_TRANSITION_INVALID` | 422 | Illegal status change |

## Refund Error Codes

| Code | Typical HTTP | When |
|------|--------------|------|
| `REFUND_RECORD_NOT_FOUND` | 404 | Refund id missing |
| `REFUND_NOT_ALLOWED` | 403 | Policy blocks refund |
| `REFUND_AMOUNT_EXCEEDS_PAID_AMOUNT` | 422 | Amount too high |
| `REFUND_ALREADY_EXISTS` | 409 | Active duplicate refund |
| `REFUND_APPROVAL_REQUIRED` | 422 | Process before approval |
| `REFUND_ALREADY_PROCESSED` | 409 | Terminal state |
| `REFUND_STATUS_TRANSITION_INVALID` | 422 | Illegal status change |
| `REFUND_GATEWAY_PROCESSING_FAILED` | 502 | Gateway refund failed |
| `REFUND_REJECTION_REASON_REQUIRED` | 422 | Reject without reason |

## Settlement Error Codes

| Code | Typical HTTP | When |
|------|--------------|------|
| `SETTLEMENT_NOT_FOUND` | 404 | Settlement id missing |
| `SETTLEMENT_PERIOD_INVALID` | 422 | Bad date range |
| `SETTLEMENT_ALREADY_GENERATED` | 409 | Duplicate generation |
| `SETTLEMENT_NO_ELIGIBLE_ORDERS` | 422 | Empty batch |
| `SETTLEMENT_STATUS_TRANSITION_INVALID` | 422 | Illegal status change |
| `SETTLEMENT_PAYOUT_DISABLED` | 403 | Payout flag off |

## Delivery Earning Error Codes

| Code | Typical HTTP | When |
|------|--------------|------|
| `DELIVERY_EARNING_NOT_FOUND` | 404 | Earning id missing |
| `DELIVERY_EARNING_ALREADY_EXISTS` | 409 | Duplicate for assignment |
| `DELIVERY_EARNING_NOT_ADJUSTABLE` | 422 | Status blocks adjust |
| `DELIVERY_EARNING_ADJUSTMENT_REASON_REQUIRED` | 422 | Missing reason |
| `DELIVERY_EARNING_STATUS_TRANSITION_INVALID` | 422 | Illegal status change |

## Endpoint Mapping

All finance payment, refund, settlement, earning, and webhook endpoints may
return codes from their domain. See `docs/contracts/phase-9-finance-api-surface.md`.

## Implementation Note

Module 1 does not create `finance-error-codes.constant.ts`. Module 2+ owns runtime
constants aligned with this document.
