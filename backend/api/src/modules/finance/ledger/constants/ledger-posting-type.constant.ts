export const LEDGER_POSTING_TYPE = {
  PAYMENT_RECEIVED: 'payment_received',
  REFUND_APPROVED: 'refund_approved',
  REFUND_PROCESSED: 'refund_processed',
  VENDOR_SETTLEMENT_APPROVED: 'vendor_settlement_approved',
  DELIVERY_EARNING_ACCRUED: 'delivery_earning_accrued',
  REVERSAL: 'reversal',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
} as const;

export const LEDGER_POSTING_TYPE_VALUES = Object.values(LEDGER_POSTING_TYPE);

export type LedgerPostingType =
  (typeof LEDGER_POSTING_TYPE)[keyof typeof LEDGER_POSTING_TYPE];
