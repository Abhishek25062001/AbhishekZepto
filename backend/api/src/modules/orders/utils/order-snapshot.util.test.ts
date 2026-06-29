import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { test } from 'node:test';
import { buildOrderPayloadFromCheckoutSession } from './order-snapshot.util';

test('buildOrderPayloadFromCheckoutSession maps checkout snapshot to order', () => {
  const sessionId = new Types.ObjectId();
  const customerId = new Types.ObjectId();
  const cartId = new Types.ObjectId();
  const storeId = new Types.ObjectId();
  const paymentId = new Types.ObjectId();

  const payload = buildOrderPayloadFromCheckoutSession({
    orderNumber: 'ORD-TEST-001',
    payment: {
      _id: paymentId,
      customerId,
      checkoutSessionId: sessionId,
      orderId: null,
      storeId,
      vendorId: null,
      cityId: null,
      gateway: 'razorpay',
      gatewayOrderId: 'order_x',
      gatewayPaymentId: 'pay_x',
      gatewayStatus: null,
      paymentMethod: null,
      amount: 25000,
      payableAmount: 25000,
      currency: 'INR',
      refundedAmount: 0,
      status: 'paid',
      idempotencyKey: 'idem',
      signatureVerified: true,
      webhookReceivedAt: null,
      webhookEventIds: [],
      failureCode: null,
      paidAt: new Date(),
      failedAt: null,
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      _id: sessionId,
      customerId,
      cartId,
      storeId,
      addressId: new Types.ObjectId(),
      addressSnapshot: {
        label: 'Home',
        line1: 'Line 1',
        line2: null,
        landmark: null,
        city: 'City',
        state: null,
        postalCode: null,
        country: 'IN',
        latitude: 0,
        longitude: 0,
      },
      status: 'initiated',
      lockTokens: [],
      reservationExpiresAt: new Date(),
      summarySnapshot: {
        currency: 'INR',
        itemCount: 1,
        subtotal: 250,
        discountAmount: 0,
        taxAmount: 0,
        deliveryFeeAmount: 0,
        grandTotal: 250,
        items: [
          {
            itemId: new Types.ObjectId().toString(),
            productId: new Types.ObjectId().toString(),
            variantId: new Types.ObjectId().toString(),
            storeProductId: new Types.ObjectId().toString(),
            productName: 'Milk',
            quantity: 1,
            unitPrice: 250,
            lineTotal: 250,
          },
        ],
      },
      paymentId: paymentId,
      orderId: null,
      idempotencyKey: null,
      failureReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  assert.equal(payload.grandTotal, 250);
  assert.equal(payload.items.length, 1);
  assert.equal(payload.orderNumber, 'ORD-TEST-001');
  assert.equal(payload.paymentRecordId?.toString(), paymentId.toString());
  assert.equal(payload.financeStatus, 'paid');
});
