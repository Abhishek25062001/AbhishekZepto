import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LEDGER_SYSTEM_ACCOUNT_CODE } from '../constants/ledger-system-account-codes.constant';
import { buildPaymentReceivedEntry } from '../services/ledger-posting-rule.service';

test('buildPaymentReceivedEntry produces balanced lines', () => {
  const lines = buildPaymentReceivedEntry({
    paymentId: 'payment-1',
    amountPaise: 10000,
    currency: 'INR',
    deliveryFeeAmount: 4000,
    taxAmount: 1000,
    discountAmount: 500,
  });

  const totalDebit = lines.reduce((sum, line) => sum + line.debitAmount, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.creditAmount, 0);

  assert.equal(totalDebit, 10000);
  assert.equal(totalCredit, 10000);
  assert.equal(lines[0]?.accountCode, LEDGER_SYSTEM_ACCOUNT_CODE.PAYMENT_GATEWAY_RECEIVABLE);
});

test('buildPaymentReceivedEntry defaults vendor payable when no fee split', () => {
  const lines = buildPaymentReceivedEntry({
    paymentId: 'payment-2',
    amountPaise: 5000,
    currency: 'INR',
  });

  assert.equal(lines.length, 2);
  assert.equal(lines[1]?.accountCode, LEDGER_SYSTEM_ACCOUNT_CODE.VENDOR_PAYABLE);
});
