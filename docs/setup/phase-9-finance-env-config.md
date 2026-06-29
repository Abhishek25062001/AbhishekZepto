# Phase 9 Finance Environment Configuration

Status: documentation + `.env.example` placeholders only. **No `env.ts` changes in Module 1.**

## Backend Environment Variables

| Variable | Required (prod) | Default (dev) | Purpose |
|----------|-----------------|---------------|---------|
| `RAZORPAY_KEY_ID` | yes | test placeholder | Gateway public/key id |
| `RAZORPAY_KEY_SECRET` | yes | placeholder | Gateway secret |
| `RAZORPAY_WEBHOOK_SECRET` | yes | placeholder | Webhook HMAC secret |
| `PAYMENT_GATEWAY` | yes | `razorpay` | Active gateway |
| `PAYMENT_CURRENCY` | yes | `INR` | Currency code |
| `PAYMENT_CAPTURE_MODE` | no | `automatic` | Capture behavior |
| `REFUND_PROCESSING_ENABLED` | no | `false` | Gateway refund execution |
| `VENDOR_PAYOUTS_ENABLED` | no | `false` | Live vendor payout |
| `DELIVERY_PAYOUTS_ENABLED` | no | `false` | Live rider payout |
| `FINANCE_WEBHOOK_LOGGING_ENABLED` | no | `true` | Safe webhook debug logs |

Phase 4 variables (`RAZORPAY_*`) already exist — see `docs/setup/phase-4-env-config.md`.

## Production Startup Rules (planned for Module 2+)

When `APP_ENV=production` and `PAYMENT_GATEWAY=razorpay`:

- Block startup if `RAZORPAY_KEY_SECRET` missing
- Block startup if `RAZORPAY_WEBHOOK_SECRET` missing
- Block startup if `PAYMENT_CURRENCY` missing

Module 1 documents rules only; `backend/api/src/config/env.ts` unchanged.

## Logging Safety

Backend logs must never print:

- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `gatewaySignature`
- Raw webhook payloads with PII/payment instrument data

## Customer App

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_KEY_ID` | Public key for SDK (already in `.env.example`) |
| `API_BASE_URL` | Backend base URL |

## Planned Runtime Validation (Module 2+)

Document only — implement in finance/payment module bootstrap ticket:

```text
backend/api/src/config/env.ts — finance env schema extension
```

## Related Documents

- `backend/api/.env.example`
- `docs/setup/phase-4-env-config.md`
