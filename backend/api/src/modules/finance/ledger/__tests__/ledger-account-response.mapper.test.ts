import assert from 'node:assert/strict';
import { Types } from 'mongoose';
import { test } from 'node:test';
import { LEDGER_ACCOUNT_STATUS } from '../constants/ledger-account-status.constant';
import { toLedgerAccountResponse } from '../utils/ledger-account-response.mapper';

test('toLedgerAccountResponse excludes internal fields', () => {
  const now = new Date();
  const response = toLedgerAccountResponse({
    _id: new Types.ObjectId(),
    accountCode: 'TEST_ACCOUNT',
    accountName: 'Test Account',
    accountType: 'asset',
    accountCategory: 'other',
    currency: 'INR',
    description: null,
    isSystemAccount: false,
    isPostingAllowed: true,
    parentAccountId: null,
    status: LEDGER_ACCOUNT_STATUS.ACTIVE,
    createdBy: new Types.ObjectId(),
    updatedBy: new Types.ObjectId(),
    isDeleted: false,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  });

  assert.equal(response.accountCode, 'TEST_ACCOUNT');
  assert.equal((response as Record<string, unknown>).isDeleted, undefined);
  assert.equal((response as Record<string, unknown>).createdBy, undefined);
});
