export const LEDGER_AUDIT_EVENTS = {
  ACCOUNT_CREATED: 'finance.ledger_account_created',
  ACCOUNT_UPDATED: 'finance.ledger_account_updated',
  ACCOUNT_ARCHIVED: 'finance.ledger_account_archived',
  JOURNAL_DRAFTED: 'finance.ledger_journal_drafted',
  JOURNAL_POSTED: 'finance.ledger_journal_posted',
  JOURNAL_REVERSED: 'finance.ledger_journal_reversed',
  POSTING_FAILED: 'finance.ledger_posting_failed',
  POSTING_RULE_APPLIED: 'finance.ledger_posting_rule_applied',
} as const;

export type LedgerAuditEvent =
  (typeof LEDGER_AUDIT_EVENTS)[keyof typeof LEDGER_AUDIT_EVENTS];
