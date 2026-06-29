import assert from 'node:assert/strict';
import { test } from 'node:test';
import { listLedgerAccountsQueryValidator } from '../validators/ledger-account.validator';
import { reverseJournalBodyValidator } from '../validators/ledger-journal.validator';

test('listLedgerAccountsQueryValidator accepts pagination filters', () => {
  const parsed = listLedgerAccountsQueryValidator.parse({
    page: '1',
    limit: '20',
    status: 'active',
  });

  assert.equal(parsed.page, 1);
  assert.equal(parsed.limit, 20);
  assert.equal(parsed.status, 'active');
});

test('reverseJournalBodyValidator requires reason', () => {
  assert.throws(() => reverseJournalBodyValidator.parse({}));
});
