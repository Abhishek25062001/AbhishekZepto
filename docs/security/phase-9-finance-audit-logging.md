# Phase 9 Finance Audit Logging

Finance audit events use existing `admin_action_audits` for admin mutations and
finance-specific event names for all finance writes.

## Finance Audit Events

| Event | Trigger |
|-------|---------|
| `finance.payment_record_created` | Payment record created |
| `finance.payment_gateway_order_created` | Razorpay order created |
| `finance.payment_verified` | Customer verify success |
| `finance.payment_failed` | Payment failed |
| `finance.payment_webhook_received` | Webhook processed |
| `finance.payment_webhook_rejected` | Webhook signature/validation failed |
| `finance.refund_requested` | Customer/admin refund request |
| `finance.refund_approved` | Admin approval |
| `finance.refund_rejected` | Admin rejection |
| `finance.refund_processing_started` | Process initiated |
| `finance.refund_processed` | Refund completed |
| `finance.refund_failed` | Refund processing failed |
| `finance.vendor_settlement_generated` | Settlement batch created |
| `finance.vendor_settlement_approved` | Settlement approved |
| `finance.vendor_settlement_marked_paid_placeholder` | Placeholder paid mark |
| `finance.delivery_earning_created` | Earning calculated |
| `finance.delivery_earning_approved` | Earning approved |
| `finance.delivery_earning_adjusted` | Admin adjustment |

## Metadata Must Include

- `entityType`
- `entityId`
- `orderId` (when applicable)
- `paymentRecordId` (when applicable)
- `refundRecordId` (when applicable)
- `actorId`
- `actorRole`
- `actorSurface`
- `changedFields`
- `requestId`
- `traceId`

## Metadata Must Not Include

- `gatewaySignature`
- `webhookSecret`
- `rawWebhookPayload`
- `authorization` / tokens
- `cardNumber`, `upiVpa`, `bankAccountNumber`
- Internal secrets

## Planned Service Write Points (Module 2+)

| Service | Writes |
|---------|--------|
| `payment-record.service.ts` | payment create/verify/fail |
| `refund.service.ts` | refund lifecycle |
| `vendor-settlement.service.ts` | settlement lifecycle |
| `delivery-earning.service.ts` | earning lifecycle |
| `razorpay-webhook.service.ts` | webhook received/rejected |

## Endpoints Requiring Audit On Write

All finance write endpoints plus:

- `POST /api/v1/public/webhooks/payments/razorpay`

## DB Fields (audit storage)

Uses existing `admin_action_audits` fields per Phase 8. No new audit collection
in Module 1.

## Related Documents

- `docs/security/phase-8-audit-log-system-permissions.md`
- `docs/architecture/phase-8-audit-log-system.md`
