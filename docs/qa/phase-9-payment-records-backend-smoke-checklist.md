# Phase 9 Payment Records Backend Smoke Checklist

## Prerequisites

- Backend running locally
- Customer JWT
- Admin JWT with `finance:payments:read`
- Razorpay webhook secret configured

## 1. Create payment order

```bash
curl -X POST "$BASE_URL/api/v1/customer/payments/create-order" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"checkoutSessionId":"<sessionId>","idempotencyKey":"smoke-1"}'
```

Expected DB: `payments` record with `gatewayOrderId`, `status=created`, `storeId` populated.

## 2. Verify payment by id

```bash
curl -X POST "$BASE_URL/api/v1/customer/payments/<paymentId>/verify" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gatewayOrderId":"<order>","gatewayPaymentId":"<pay>","gatewaySignature":"<sig>"}'
```

Expected DB: payment `status=paid`, `paidAt` set; order `financeStatus=paid`.

## 3. Get customer payment

```bash
curl "$BASE_URL/api/v1/customer/payments/<paymentId>" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

Expected: 200 with sanitized payment payload (no signature/metadata).

## 4. Admin list payments

```bash
curl "$BASE_URL/api/v1/admin/finance/payments?page=1&limit=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Expected: 200 with paginated admin payment list.

## 5. Admin payment detail

```bash
curl "$BASE_URL/api/v1/admin/finance/payments/<paymentId>" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Expected: 200 with scoped admin payment detail.

## 6. Razorpay webhook (public path)

```bash
curl -X POST "$BASE_URL/api/v1/public/webhooks/payments/razorpay" \
  -H "x-razorpay-signature: <signature>" \
  -H "Content-Type: application/json" \
  -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_x","order_id":"<gatewayOrderId>"}}}}'
```

Expected: 200; duplicate event id does not double-update payment/order.

## Audit Checks

- `payment.order_created`, `payment.verified`, `payment.webhook_received` audit events present
- Audit metadata must not include signatures or secrets
