import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeLedgerAccountCode } from '../utils/ledger-account-code.util';

test('normalizeLedgerAccountCode uppercases and snake-cases input', () => {
  assert.equal(normalizeLedgerAccountCode(' vendor-payable '), 'VENDOR_PAYABLE');
  assert.equal(normalizeLedgerAccountCode('platform fee revenue'), 'PLATFORM_FEE_REVENUE');
});
