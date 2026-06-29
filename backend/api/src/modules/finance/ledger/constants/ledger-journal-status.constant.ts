export const LEDGER_JOURNAL_STATUS = {
  DRAFT: 'draft',
  POSTED: 'posted',
  REVERSED: 'reversed',
  VOIDED: 'voided',
} as const;

export const LEDGER_JOURNAL_STATUS_VALUES = Object.values(LEDGER_JOURNAL_STATUS);

export type LedgerJournalStatus =
  (typeof LEDGER_JOURNAL_STATUS)[keyof typeof LEDGER_JOURNAL_STATUS];
