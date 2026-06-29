import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LEDGER_SYSTEM_ACCOUNT_CODE_VALUES } from '../constants/ledger-system-account-codes.constant';

test('system ledger account seed matrix includes required account codes', () => {
  const required = [
    'PAYMENT_GATEWAY_RECEIVABLE',
    'VENDOR_PAYABLE',
    'DELIVERY_PARTNER_PAYABLE',
    'PLATFORM_FEE_REVENUE',
    'DELIVERY_FEE_REVENUE',
    'COMMISSION_REVENUE',
    'TAX_PAYABLE',
    'REFUND_PAYABLE',
    'DISCOUNT_EXPENSE',
    'MANUAL_ADJUSTMENT',
  ];

  for (const code of required) {
    assert.ok(
      LEDGER_SYSTEM_ACCOUNT_CODE_VALUES.includes(
        code as (typeof LEDGER_SYSTEM_ACCOUNT_CODE_VALUES)[number],
      ),
    );
  }
});
