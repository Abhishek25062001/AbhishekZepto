export const LEDGER_SOURCE_TYPE = {
  PAYMENT: 'payment',
  REFUND: 'refund',
  ORDER: 'order',
  VENDOR_SETTLEMENT: 'vendor_settlement',
  DELIVERY_EARNING: 'delivery_earning',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
  SYSTEM_REVERSAL: 'system_reversal',
} as const;

export const LEDGER_SOURCE_TYPE_VALUES = Object.values(LEDGER_SOURCE_TYPE);

export type LedgerSourceType =
  (typeof LEDGER_SOURCE_TYPE)[keyof typeof LEDGER_SOURCE_TYPE];
