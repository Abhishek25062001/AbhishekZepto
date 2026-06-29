import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LEDGER_AUDIT_EVENTS } from '../constants/ledger-audit-events.constant';

test('ledger audit events include required finance ledger events', () => {
  assert.equal(LEDGER_AUDIT_EVENTS.ACCOUNT_CREATED, 'finance.ledger_account_created');
  assert.equal(LEDGER_AUDIT_EVENTS.JOURNAL_POSTED, 'finance.ledger_journal_posted');
  assert.equal(LEDGER_AUDIT_EVENTS.JOURNAL_REVERSED, 'finance.ledger_journal_reversed');
  assert.equal(LEDGER_AUDIT_EVENTS.POSTING_FAILED, 'finance.ledger_posting_failed');
  assert.equal(LEDGER_AUDIT_EVENTS.POSTING_RULE_APPLIED, 'finance.ledger_posting_rule_applied');
});
