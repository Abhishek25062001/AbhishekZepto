# Phase 4 Environment Configuration

Status: **IMPLEMENTED** — `env.ts` Razorpay validation in Module 8 (2026-05-19).

## Backend (`backend/api/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `RAZORPAY_KEY_ID` | Module 8+ | Razorpay API key id |
| `RAZORPAY_KEY_SECRET` | Module 8+ | Secret (server only) |
| `RAZORPAY_WEBHOOK_SECRET` | Module 8+ | Webhook HMAC secret |
| `CHECKOUT_RESERVATION_TTL_SECONDS` | Module 6+ | Default `900` (15 min) |
| `CHECKOUT_RESERVATION_CRON_ENABLED` | Optional | Expire stale sessions |
| `CART_MAX_QUANTITY_PER_LINE` | Optional | Default `10` |
| `CART_TAX_RATE_PERCENT` | Module 5+ | Flat tax rate 0–100; default `0` |
| `CART_DELIVERY_FEE_AMOUNT` | Module 5+ | Flat delivery fee; default `0` |

Existing Phase 3 vars used unchanged:

- `DB_MONGO_URI`, `JWT_*`, `OTP_*`
- `INVENTORY_LOCK_EXPIRY_JOB_*`

## Customer App (`apps/customer-app/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `API_BASE_URL` | yes | Backend URL |
| `RAZORPAY_KEY_ID` | Module 9 | Public key for SDK fallback (prefer `keyId` from create-order) |
| `APP_ENV` | yes | `development` |

Android emulator: `http://10.0.2.2:5000` for `API_BASE_URL`.

## Security

- Never commit real secrets.
- `.env.example` contains placeholders only.
- Production keys via deployment secret store (`project-context/DEPLOYMENT_CONTEXT.md`).

## Module 0

Updates `.env.example` files with commented placeholders only — no `env.ts` code changes.
