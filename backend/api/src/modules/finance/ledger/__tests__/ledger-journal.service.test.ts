import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatJournalCode } from '../utils/ledger-journal-code.util';
import { calculateNormalBalance } from '../services/ledger-journal.service';
import { LEDGER_ACCOUNT_TYPE } from '../constants/ledger-account-type.constant';

test('formatJournalCode uses JRN-YYYYMMDD-000001 pattern', () => {
  const code = formatJournalCode(new Date('2026-06-17T00:00:00.000Z'), 1);
  assert.equal(code, 'JRN-20260617-000001');
});

test('calculateNormalBalance uses debit-normal for asset accounts', () => {
  const balance = calculateNormalBalance(LEDGER_ACCOUNT_TYPE.ASSET, 1000, 400);
  assert.equal(balance, 600);
});

test('calculateNormalBalance uses credit-normal for liability accounts', () => {
  const balance = calculateNormalBalance(LEDGER_ACCOUNT_TYPE.LIABILITY, 200, 900);
  assert.equal(balance, 700);
});
